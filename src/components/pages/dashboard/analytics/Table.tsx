import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";

import {
  Card as MuiCard,
  CardHeader,
  Chip as MuiChip,
  Paper,
  Button as MuiButton,
  Snackbar,
} from "@mui/material";
import { spacing } from "@mui/system";
import { gql, useMutation, useQuery } from "@apollo/client";
const Card = styled(MuiCard)(spacing);
const Button = styled(MuiButton)(spacing);
import { DataGrid, GridColDef, GridToolbar, GridOverlay } from '@mui/x-data-grid';
import { CircularProgress, Typography } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useRouter } from "next/navigation";
import { TextField } from '@mui/material';
import { setUsers ,editUser } from "@/redux/slices/userReducer";
import { useDispatch } from "react-redux";

interface RowData {
  id: Number;
  firstName: any;
  lastName: any;
  email: any,
  phone: any;
  role: any;
  status: any;
  type: any;
}

interface CustomToolbarProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const DELETE_USERS_MUTATION = gql`
  mutation DeleteUsers($ids: [Float!]!) {
    deleteUsers(ids: $ids)
  }
`;

const GET_USERS = gql`
query GetUsers($excludeId: Float  $limit: Float, $offset: Float) {
  users (excludeId: $excludeId limit: $limit, offset: $offset){
    id
    firstName
    lastName
    email
    phone
    role
    status
    type
  }
}
`;

const GET_USER_COUNT = gql`
  query GetUserCount {
    userCount
  }
`;

const DashboardTable = () => {
  const router = useRouter();
  const [list, setList] = useState<RowData[]>([]);
  const [selectedIds,setSelectedIds]= useState([]);
  const localStore= localStorage.getItem("userInfo");
  const userDetail = localStore? JSON.parse(localStore):null;
  const {id}=userDetail;
  const [pageNumber, setPageNumber] = useState(1);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, 
    pageSize: 10,
  });
  const { loading, error, data ,refetch} = useQuery(GET_USERS,{variables:{excludeId: id , limit:  paginationModel.pageSize,  offset: paginationModel.page * paginationModel.pageSize}, fetchPolicy: "network-only"});
  const [deleteUsers, {  }] = useMutation(DELETE_USERS_MUTATION);
  const [deleteStatus,setDeleteStatus] =useState(false);
  const [loader, setLoader] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch= useDispatch();
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const { data: countData } = useQuery(GET_USER_COUNT);
  const totalPages = countData ? Math.ceil(countData.userCount / 10) : 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);


  
  useEffect(() => {
    setLoader(true)
    if (data) {
      setList(data.users);
      setTimeout(() => {
        setLoader(false);
      }, 2000);
    }
  }, [data]);

  const deleteUser = async (username:any) => {
    try {
      const response = await fetch("/api/user-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete user");
      }
  
      const data = await response.json();
      console.log("User deleted successfully:", data);
      // alert(`User ${username} deleted successfully`);
    } catch (error) {
      console.error("Error deleting user:", error);
      // alert(error.message);
    }
  };


  const columns: GridColDef<RowData>[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'firstName', headerName: 'First Name', width: 120 },
    { field: 'lastName', headerName: 'Last Name', width: 120 },
    { field: 'email', headerName: 'Email', width: 180 },
    { field: 'phone', headerName: 'Phone Number', type: 'number', width: 120 },
    {
      field: 'role', headerName: 'Role', width: 90, renderCell: (params) => (
        <Button variant="outlined" color="primary" size="small" sx={{ textTransform: 'capitalize' }}>
          {params.value}
        </Button>
      )
    },
    {
      field: 'status', headerName: 'Status', type: 'string', width: 100, renderCell: (params) => (
        <Button variant="outlined" color={`${params.value == 1? "success":"error"}`} size="small" sx={{ textTransform: 'capitalize' }}>
          {params.value == 1 ? 'Approved' : 'Disapproved'}
        </Button>
      )
    },
    {
      field: '', headerName: 'Action', type: 'string', width: 200, renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() =>{
              dispatch(editUser(params.row)),
              router.push(`/users/edit/${params.row.id}`)
            }
            }
            style={{ marginRight: 8 }}
          >
            <Edit fontSize="small" /> Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row)}
          >
            <Delete fontSize="small" /> Delete
          </Button>
        </>
      )
    }
  ];


 

  const handleDelete = async(ids: any) => {

  if(selectedIds?.length>0&&ids==""){
  const response = await deleteUsers({ variables: {ids: selectedIds.map((id:any) => parseFloat(id.toString()))}});
  if(response?.data?.deleteUsers){
  setDeleteStatus(true);
   await refetch();
  } 
  }else{
    const response = await deleteUsers({ variables: { ids } });
    if(response?.data?.deleteUsers){
    setDeleteStatus(true);
    await refetch();
   }
}

  }

  function CustomLoadingOverlay() {
    return (
      <GridOverlay>
        <CircularProgress />
      </GridOverlay>
    );
  }

  function CustomNoRowsOverlay() {
    return (
      <GridOverlay>
        <Typography variant="h6" color="textSecondary">
          No data available
        </Typography>
      </GridOverlay>
    );
  }

  const handlePaginationChange = (paginationModel: { page: number; pageSize: number }) => {
    setPaginationModel(paginationModel);
    refetch({
        excludeId: id,
        limit: paginationModel.pageSize,
        offset: paginationModel.page * paginationModel.pageSize,
    });
  };

  const filteredRows = list.filter((row) =>
    Object.keys(row).some((column) => {
      const value = row[column as keyof RowData];
      return value?.toString().toLowerCase().includes(debouncedSearchQuery.toLowerCase());
    })
  );

  const handleSelectionChange = (id:any) => {
    setSelectedIds(id);
  };

  const CustomToolbar: React.FC<CustomToolbarProps> = ({ searchQuery, setSearchQuery }) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
        <GridToolbar />
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '200px' }}
        />
      </div>
    );
  };

  return (
    <>
    <Snackbar
    anchorOrigin={{ vertical:"top", horizontal:"right" }}
     open={deleteStatus}
    onClose={()=>setDeleteStatus(false)}
    message="User Deleted Successfully"
    key={"top" + "right"}
  />
      <Card mb={6}>
        <CardHeader
          action={
            <Button mr={2} mb={2} variant="contained" onClick={() => {
              router.push("/users/add");
            }}>
              Add New User
            </Button>
          }
          title="Users List"
        />
        <Paper>
           {selectedIds?.length > 0 &&<Button mr={2} mb={2} variant="contained" onClick={()=>handleDelete("")} > Delete Selected </Button>}
           <DataGrid
               pagination
               paginationMode="server"
               paginationModel={paginationModel}
               onPaginationModelChange={handlePaginationChange}
                rows={filteredRows}
               rowCount={countData ? countData.userCount : 0} 
               columns={columns}
               checkboxSelection
               onRowSelectionModelChange={handleSelectionChange}
               disableRowSelectionOnClick
               loading={loader}
                slots={{
                toolbar: (props) => <CustomToolbar {...props} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />,
                loadingOverlay: CustomLoadingOverlay,
                 noRowsOverlay: CustomNoRowsOverlay,
    }}
/>
        </Paper>
      </Card>
    </>
  )
};

export default DashboardTable;
