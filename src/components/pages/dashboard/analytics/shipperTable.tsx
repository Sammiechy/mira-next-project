import React, { useEffect, useState } from "react";
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
import { GET_SHIPPERS } from "@/hooks/queries/queries";

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


const DELETE_MULTIPLE_ORGANIZATIONS = gql`
  mutation DeleteMultipleOrganizations($ids: [Int!]!) {
    deleteMultipleOrganizations(ids: $ids)
  }
`;

const ShipperTable = () => {
  const router = useRouter();
  const [list, setList] = useState<RowData[]>([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const localStore = localStorage?.getItem("userInfo");
  const userDetail = localStore ? JSON.parse(localStore) : null;
  const { id } = userDetail;
  const [count, setCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 10,
  });
  const { loading, error, data, refetch } = useQuery(GET_SHIPPERS, {
    variables: { page: paginationModel?.page, limit: paginationModel.pageSize },
  });
  const [deleteMultipleOrganizations] = useMutation(DELETE_MULTIPLE_ORGANIZATIONS);
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [loader, setLoader] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
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
      setList(data.getShippers?.shippers);
      setCount(data.getOrganizations?.shippers?.length)
      setTimeout(() => {
        setLoader(false);
      }, 2000);
    }
    refetch();
  }, [data]);


  const columns: GridColDef<RowData>[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'Name', headerName: 'Name', width: 120 },
    { field: 'Email', headerName: 'Email', width: 120 },
    { field: 'Phone', headerName: 'Phone Number', type: 'number', width: 120 },
    { field: 'organizationId', headerName: 'Organization', type: 'number', width: 120 },
    {
      field: 'LocationID', headerName: 'Location', type: 'number', width: 120, renderCell: (params) => (
        <>
          {
            params.value == '1' ? 'Chandigarh' :
              params.value == '2' ? 'Mohali' :
                params.value == '3' ? 'Delhi' :
                  params.value == '4' ? 'Pune' :
                    'Hyderabad'
          }
        </>
      )
    },
    {
      field: '', headerName: 'Action', type: 'string', width: 200, renderCell: (params) => (
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
        message="Organization Deleted Successfully"
        key={"top" + "right"}
      />
      <Card mb={6}>
        <CardHeader
          action={
            <Button mr={2} mb={2} variant="contained" onClick={() => {
              router.push("/organization/add");
            }}>
              Add New Shipper
            </Button>
          }
          title="Shipper List"
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

export default ShipperTable;
