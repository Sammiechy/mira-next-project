import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { MoreVertical } from "lucide-react";

import {
  Card as MuiCard,
  CardHeader,
  Chip as MuiChip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { spacing } from "@mui/system";
import { useMutation,gql,useQuery } from "@apollo/client";
const Card = styled(MuiCard)(spacing);

const Chip = styled(MuiChip)`
  height: 20px;
  padding: 4px 0;
  font-size: 90%;
  background-color: ${(props) =>
    props.theme.palette[props.color ? props.color : "primary"].light};
  color: ${(props) => props.theme.palette.common.white};
`;

const TableWrapper = styled.div`
  overflow-y: auto;
  max-width: calc(100vw - ${(props) => props.theme.spacing(12)});
`;

// Data
let id = 0;
const createData = (
  source: string,
  users: string,
  sessions: string,
  bounce: JSX.Element,
  avg: string
) => {
  id += 1;
  return { id, source, users, sessions, bounce, avg };
};

const DashboardTable = () => {
  const[list,setList]=useState([])
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
  if (data) {
    setList(data.users); 
  }
}, [data]);
if (loading) return <p>Loading...</p>;
if (error) return <p>Error: {error.message}</p>;



return (<>
  <Card mb={6}>
    <CardHeader
      action={
        <IconButton aria-label="settings" size="large">
          <MoreVertical />
        </IconButton>
      }
      title="Users"
    />

    <Paper>
      <TableWrapper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="right">First Name</TableCell>
              <TableCell align="right">Last Name</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Phone </TableCell>
              <TableCell align="right">Role </TableCell>
              <TableCell align="right">Status </TableCell>


            </TableRow>
          </TableHead>
          <TableBody>
            {list?.map((row:any) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="right">{row.firstName}</TableCell>
                <TableCell align="right">{row.lastName}</TableCell>
                <TableCell align="right">{row.email}</TableCell>
                <TableCell align="right">{row.phone}</TableCell>
                <TableCell align="right">{row.role}</TableCell>
                <TableCell align="right">{row.status=="1"?"Active":"none"}</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>
    </Paper>
  </Card>
  </>
)
};

export default DashboardTable;
