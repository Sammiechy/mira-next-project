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


export const GET_ORGANIZATIONS = gql`
  query PaginatedOrganizations($page: Int, $limit: Int) {
    getOrganizations(page: $page, limit: $limit) {
      organizations {
        id
        Name
        Email
        Website
        LocationID
        Phone
      }
      totalCount
    }
  }
`;

const DELETE_MULTIPLE_ORGANIZATIONS = gql`
  mutation DeleteMultipleOrganizations($ids: [Int!]!) {
    deleteMultipleOrganizations(ids: $ids)
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

const OrganizationTable = () => {
  const router = useRouter();
  const [list, setList] = useState<RowData[]>([]);
  const [selectedIds,setSelectedIds]= useState([]);
  const localStore= localStorage.getItem("userInfo");
  const userDetail = localStore? JSON.parse(localStore):null;
  const {id}=userDetail;
  const [count, setCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 1, 
    pageSize: 10,
  });
  const { loading, error, data ,refetch } = useQuery(GET_ORGANIZATIONS, {
    variables: { page: paginationModel?.page, limit: paginationModel.pageSize },
  });
  const [deleteMultipleOrganizations] = useMutation(DELETE_MULTIPLE_ORGANIZATIONS);
  const [deleteStatus,setDeleteStatus] =useState(false);
  const [loader, setLoader] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch= useDispatch();
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  // const { data: countData } = useQuery(GET_USER_COUNT);
  // const totalPages = countData ? Math.ceil(countData.userCount / 10) : 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);


  
  useEffect(() => {
    setLoader(true)
    if (data) {
      setList(data.getOrganizations?.organizations);
      setCount(data.getOrganizations?.totalCount)
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
    { field: 'Name', headerName: 'Name', width: 120 },
    { field: 'Email', headerName: 'Email', width: 120 },
    { field: 'Phone', headerName: 'Phone Number', type: 'number', width: 120 },
    { field: 'Website', headerName: 'Website', type: 'number', width: 120 },
    { field: 'LocationID', headerName: 'LocationID', type: 'number', width: 120 },
      {field: '', headerName: 'Action', type: 'string', width: 200, renderCell: (params) => (
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
            onClick={() => handleDelete(params.row?.id)}
          >
            <Delete fontSize="small" /> Delete
          </Button>
        </>
      )
    }
  ];


 

  const handleDelete = async(ids: any) => {
  if(selectedIds?.length>0&&ids==""){
  const response = await deleteMultipleOrganizations({ variables: {ids: selectedIds.map((id:any) => parseFloat(id.toString()))}});
  if(response.data.deleteMultipleOrganizations){
  setDeleteStatus(true);
   await refetch();
  } 
  }else{
    const response = await deleteMultipleOrganizations({ variables: { ids } });
    if(response.data.deleteMultipleOrganizations){
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

  // const handlePaginationChange = (paginationModel: { page: number; pageSize: number }) => {
  //   setPaginationModel(paginationModel);
  //   refetch({
  //       excludeId: id,
  //       limit: paginationModel.pageSize,
  //       offset: paginationModel.page * paginationModel.pageSize,
  //   });
  // };

  const filteredRows = list?.filter((row) =>
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
    message="Organization Deleted Successfully"
    key={"top" + "right"}
  />
      <Card mb={6}>
        <CardHeader
          action={
            <Button mr={2} mb={2} variant="contained" onClick={() => {
              router.push("/users/add");
            }}>
              Add New Organization
            </Button>
          }
          title="Organization List"
        />
        <Paper>
           {selectedIds?.length > 0 &&<Button mr={2} mb={2} variant="contained" onClick={()=>handleDelete("")} > Delete Selected </Button>}
           <DataGrid
               pagination
               paginationMode="server"
               paginationModel={paginationModel}
              //  onPaginationModelChange={handlePaginationChange}
                rows={filteredRows}
               rowCount={count ? count : 0} 
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

export default OrganizationTable;
