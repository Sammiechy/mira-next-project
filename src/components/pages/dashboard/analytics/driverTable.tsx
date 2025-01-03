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
import { setUsers, setEditOrganization } from "@/redux/slices/userReducer";
import { useDispatch } from "react-redux";
import { GET_DRIVERS } from "@/hooks/queries/queries";
import { DELETE_MULTIPLE_DRIVERS } from "@/hooks/mutations/mutation";

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

const DriverTable = () => {
  const router = useRouter();
  const [list, setList] = useState<RowData[]>([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const localStore = localStorage?.getItem("userInfo");
  const inputRef = useRef<HTMLInputElement>(null);
  const userDetail = localStore ? JSON.parse(localStore) : null;
  const { id } = userDetail;
  const [count, setCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 10,
  });
  const { loading, error, data, refetch } = useQuery(GET_DRIVERS, {
    variables: { page: paginationModel?.page, limit: paginationModel.pageSize },
  });
  const [deleteDrivers] = useMutation(DELETE_MULTIPLE_DRIVERS)
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [loader, setLoader] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

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
      setList(data.getDrivers?.drivers);
      setCount(data.getDrivers?.drivers?.length)
      setTimeout(() => {
        setLoader(false);
      }, 2000);
    }
    refetch();
  }, [data]);


  const columns: GridColDef<RowData>[] = [
    { field: 'id', headerName: 'ID', width: 50, headerAlign:'left', align:'left' },
    { field: 'FirstName', headerName: 'First Name', width: 100, headerAlign:'left', align:'left'  },
    { field: 'LastName', headerName: 'Last Name', width: 100, headerAlign:'left', align:'left'  },
    { field: 'Phone', headerName: 'Phone', width: 100, headerAlign:'left', align:'left'  },
    { field: 'Email', headerName: 'Email', width: 120, headerAlign:'left', align:'left'  },
    { field: 'PaymentMethod', headerName: 'Payment Method', width: 130 },
    {
      field: 'organization', headerName: 'Organization', width: 100, renderCell: (params) => (
        <>
          {params.value ? params.value.Name : 'No Organization'}
        </>

      )
    },
    { field: 'Notes', headerName: 'Notes', width: 180 },
    {
      field: '', headerName: 'Action', type: 'string', width: 180, renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => {
              dispatch(setEditOrganization(params.row)),
                router.push(`/driver/edit/${params.row.id}`)
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
      const response = await deleteDrivers({ variables: { ids: selectedIds.map((id: any) => parseFloat(id.toString())) } });
      if (response.data.deleteMultipleDrivers) {
        setDeleteStatus(true);
        await refetch();
      }
    } else {
      const response = await deleteDrivers({ variables: { ids } });
      if (response.data.deleteMultipleDrivers) {
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
          ref={inputRef}
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
        message="Driver Deleted Successfully"
        key={"top" + "right"}
      />
      <Card mb={6}>
        <CardHeader
          action={
            <Button mr={2} mb={2} variant="contained" onClick={() => {
              router.push("/driver/add");
            }}>
              Add New Driver
            </Button>
          }
          title="Drivers List"
        />
        <Paper>
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

export default DriverTable;
