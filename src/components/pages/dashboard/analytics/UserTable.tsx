import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";

import {
  Card as MuiCard,
  CardHeader,
  Chip as MuiChip,
  Paper,
  Button as MuiButton,
  Snackbar,
  Stack,
} from "@mui/material";
import { spacing } from "@mui/system";
import { useMutation, useQuery } from "@apollo/client";
const Card = styled(MuiCard)(spacing);
const Button = styled(MuiButton)(spacing);
import { DataGrid, GridColDef, GridToolbar, GridOverlay } from '@mui/x-data-grid';
import { CircularProgress, Typography } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useRouter } from "next/navigation";
import { TextField } from '@mui/material';
import { editUser } from "@/redux/slices/userReducer";
import { useDispatch } from "react-redux";
import { GET_USERS } from "@/hooks/queries/queries";
import { DELETE_USERS_MUTATION } from "@/hooks/mutations/mutation";

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

const UserTable = () => {
  const router = useRouter();
  const [list, setList] = useState<RowData[]>([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const localStore = localStorage.getItem("userInfo");
  const userDetail = localStore ? JSON.parse(localStore) : null;
  const { id } = userDetail;
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { data, refetch } = useQuery(GET_USERS, {
    variables: { page: paginationModel?.page, limit: paginationModel.pageSize },
  });

  const [deleteUsers, { }] = useMutation(DELETE_USERS_MUTATION);
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [loader, setLoader] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); 
    }
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);



  useEffect(() => {
    setLoader(true)
    if (data) {
      setList(data?.users?.users);
      setCount(data?.users?.totalCount)
      setTimeout(() => {
        setLoader(false);
      }, 2000);
    }
    refetch();
  }, [data,]);


  const columns: GridColDef<RowData>[] = [
    { field: 'id', headerName: 'ID', width: 50, headerAlign: 'left', align: 'left' },
    { field: 'firstName', headerName: 'First Name', width: 100, headerAlign: 'left', align: 'left' },
    { field: 'lastName', headerName: 'Last Name', width: 100, headerAlign: 'left', align: 'left' },
    { field: 'email', headerName: 'Email', width: 195, headerAlign: 'left', align: 'left' },
    { field: 'phone', headerName: 'Phone Number', type: 'number', width: 100, headerAlign: 'left', align: 'left' },
    { field: 'organization', headerName: 'Organization', type: 'number', width: 100, headerAlign: 'left', align: 'left' , renderCell: (params) => (
    <>
     {params.value ? params.value.Name : 'No Organization'}
    </>
     )},
    {
      field: 'role', headerName: 'Role', width: 90, headerAlign: 'left', align: 'left', renderCell: (params) => (
        <Button variant="outlined" color="primary" size="small" sx={{ textTransform: 'capitalize' }}>
          {params.value}
        </Button>
      )
    },
    {
      field: 'status', headerName: 'Status', type: 'string', width: 115, headerAlign: 'left', align: 'left', renderCell: (params) => (
        <Button variant="outlined" color={`${params.value == 1 ? "success" : "error"}`} size="small" sx={{ textTransform: 'capitalize' }}>
          {params.value == 1 ? 'Approved' : 'Disapproved'}
        </Button>
      )
    },
    {
      field: '', headerName: 'Action', type: 'string', width: 200, headerAlign: 'left', align: 'left', renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => {
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
            onClick={() => handleDelete(params.row.id)}
          >
            <Delete fontSize="small" /> Delete
          </Button>
        </>
      )
    }
  ];

  const handleDelete = async (ids: any) => {

    if (selectedIds?.length > 0 && ids == "") {
      const response = await deleteUsers({ variables: { ids: selectedIds.map((id: any) => parseFloat(id.toString())) } });
      if (response?.data?.deleteUsers) {
        setDeleteStatus(true);
        await refetch();
      }
    } else {
      const response = await deleteUsers({ variables: { ids } });
      if (response?.data?.deleteUsers) {
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

  function CustomNoRowsOverlay(searchQuery:any) {
    return (
      <GridOverlay>
        <Typography variant="h6" color="textSecondary">
        {searchQuery
          ? `No data found for "${searchQuery}"`
          : "No data available"}
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
    }).then((refetchedData) => {
      if (refetchedData?.data?.users?.users) {
        setList(refetchedData.data.users.users); 
        // setCount(refetchedData.data.users.totalCount); 
      }
    })
  };

  const filteredRows = list.filter((row) =>
    Object.keys(row).some((column) => {
      const value = row[column as keyof RowData];
      return value?.toString().toLowerCase().includes(debouncedSearchQuery.toLowerCase());
    })
  );

  const handleSelectionChange = (id: any) => {
    setSelectedIds(id);
  };

  const CustomToolbar: React.FC<CustomToolbarProps> =  ({ searchQuery, setSearchQuery }) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
        <GridToolbar />
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          inputRef={inputRef} 
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
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={deleteStatus}
        onClose={() => setDeleteStatus(false)}
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
          <DataGrid
            pagination
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationChange}
            rows={filteredRows}
            rowCount={count ? count : 0}
            columns={columns}
            checkboxSelection
            onRowSelectionModelChange={handleSelectionChange}
            disableRowSelectionOnClick
            loading={loader}
            slots={{
              toolbar: (props) =>
                <div>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ marginBottom: 2 }}
                  >
                    {selectedIds?.length > 0 &&
                      <Button mr={2} mb={2}
                        variant="contained"
                        onClick={() => handleDelete("")}>
                        Delete Selected
                      </Button>
                    }
                  </Stack>
                  <CustomToolbar
                    // {...props}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery} />

                </div>,
              loadingOverlay: CustomLoadingOverlay,
             noRowsOverlay: () => <CustomNoRowsOverlay searchQuery={searchQuery} />
            }}
          />
        </Paper>
      </Card>
    </>
  )
};

export default UserTable;
