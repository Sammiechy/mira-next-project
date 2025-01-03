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
import { gql, useMutation, useQuery } from "@apollo/client";
const Card = styled(MuiCard)(spacing);
const Button = styled(MuiButton)(spacing);
import { DataGrid, GridColDef, GridToolbar, GridOverlay } from '@mui/x-data-grid';
import { CircularProgress, Typography } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useRouter } from "next/navigation";
import { TextField } from '@mui/material';
import { setEditOrganization } from "@/redux/slices/userReducer";
import { useDispatch } from "react-redux";
import { GET_ORGANIZATIONS } from "@/hooks/queries/queries";
import { DELETE_MULTIPLE_ORGANIZATIONS } from "@/hooks/mutations/mutation";

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


const OrganizationTable = () => {
  const router = useRouter();
  const [list, setList] = useState<RowData[]>([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const localStore = localStorage?.getItem("userInfo");
  const userDetail = localStore ? JSON.parse(localStore) : null;
  const [count, setCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 10,
  });
  const [deleteMultipleOrganizations] = useMutation(DELETE_MULTIPLE_ORGANIZATIONS);
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [loader, setLoader] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data, refetch } = useQuery(GET_ORGANIZATIONS, {
    variables: { page: paginationModel?.page, limit: paginationModel.pageSize },
  });

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
      setList(data.getOrganizations?.organizations);
      setCount(data.getOrganizations?.organizations?.length)
      setTimeout(() => {
        setLoader(false);
      }, 2000);
    }
    refetch();
  }, [data]);

  const columns: GridColDef<RowData>[] = [
    { field: 'id', headerName: 'ID', width: 50, align: 'left'  },
    { field: 'Name', headerName: 'Name', width: 120, headerAlign:'left', align:'left' },
    { field: 'Email', headerName: 'Email', width: 150, headerAlign:'left', align:'left'},
    { field: 'Phone', headerName: 'Phone Number', type: 'number', width: 120, headerAlign:'left', align:'left'  },
    { field: 'Website', headerName: 'Website', type: 'number', width: 195, headerAlign:'left', align:'left' },
    {
      field: 'address', headerName: 'Location', type: 'number', width: 200, headerAlign:'left', align:'left' , renderCell: (params) => (
        <>
          {params.value}
        </>
      )
    },
    {
      field: '', headerName: 'Action', type: 'string', width: 180, headerAlign:'left', align:'left' , renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => {
              dispatch(setEditOrganization(params.row)),
                router.push(`/organization/edit/${params.row.id}`)
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

  const handleDelete = async (ids: any) => {
    if (selectedIds?.length > 0 && ids == "") {
      const response = await deleteMultipleOrganizations({ variables: { ids: selectedIds.map((id: any) => parseFloat(id.toString())) } });
      if (response.data.deleteMultipleOrganizations) {
        setDeleteStatus(true);
        await refetch();
      }
    } else {
      const response = await deleteMultipleOrganizations({ variables: { ids } });
      if (response.data.deleteMultipleOrganizations) {
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

  const filteredRows = list?.filter((row) =>
    Object.keys(row).some((column) => {
      const value = row[column as keyof RowData];
      return value?.toString().toLowerCase().includes(debouncedSearchQuery.toLowerCase());
    })
  );

  const handleSelectionChange = (id: any) => {
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
          inputRef={inputRef} 
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
        message="Organization Deleted Successfully"
        key={"top" + "right"}
      />
      <Card mb={6}>
        <CardHeader
          action={
            <Button mr={2} mb={2} variant="contained" onClick={() => {
              router.push("/organization/add");
            }}>
              Add New Organization
            </Button>
          }
          title="Organization List"
        />
        <Paper>
          <DataGrid
            pagination
            paginationMode="server"
            paginationModel={paginationModel}
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
                    {selectedIds?.length > 0 && (
                      <Button
                        variant="contained"
                        onClick={() => handleDelete("")}
                      >
                        Delete Selected
                      </Button>
                    )}
                  </Stack>
                  <CustomToolbar
                    {...props}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
                </div>
              ,
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
