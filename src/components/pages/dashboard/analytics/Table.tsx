import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";

import {
  Card as MuiCard,
  CardHeader,
  Chip as MuiChip,
  Paper,
  Button as MuiButton,
} from "@mui/material";
import { spacing } from "@mui/system";
import { gql, useQuery } from "@apollo/client";
const Card = styled(MuiCard)(spacing);
const Button = styled(MuiButton)(spacing);
import { DataGrid, GridColDef, GridToolbar, GridOverlay } from '@mui/x-data-grid';
import { CircularProgress, Typography } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useRouter } from "next/navigation";
import { TextField } from '@mui/material';

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


const DashboardTable = () => {
  const router = useRouter();
  const [list, setList] = useState<RowData[]>([]);
  const [loader, setLoader] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // Debounced searchQuery state
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    // Set up debouncing
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer); // Clean up the timeout
  }, [searchQuery]);

  const GET_USERS = gql`
  query GetUsers {
    users {
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
  const { loading, error, data } = useQuery(GET_USERS);
  useEffect(() => {
    setLoader(true)
    if (data) {
      setList(data.users);
      setTimeout(() => {
        setLoader(false);
      }, 2000);
    }
  }, [data]);




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
        <Button variant="outlined" color="success" size="small" sx={{ textTransform: 'capitalize' }}>
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
            onClick={() =>
              router.push(`/users/edit/${params.row.id}`)
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


  const handleDelete = (id: any) => {
    alert('Delete User ' + id)
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


  const filteredRows = list?.filter((row) =>
    columns?.some((column) => {
      const value = row[column.field as keyof RowData]; // Type assertion here
      return value?.toString().toLowerCase().includes(searchQuery.toLowerCase());
    })
  );

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
            rows={filteredRows}
            columns={columns}
            slots={{
              toolbar: (props) => <CustomToolbar {...props} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />,
              loadingOverlay: CustomLoadingOverlay,
              noRowsOverlay: CustomNoRowsOverlay,
            }}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
            checkboxSelection
            disableRowSelectionOnClick
            loading={loader}
          />
        </Paper>
      </Card>
    </>
  )
};

export default DashboardTable;
