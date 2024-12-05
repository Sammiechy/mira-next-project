import React from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";

import { green } from "@mui/material/colors";

import {
  Avatar,
  Badge,
  Divider,
  Tooltip,
  Menu,
  MenuItem,
  IconButton as MuiIconButton,
} from "@mui/material";
import { spacing } from "@mui/system";

import useAuth from "@/hooks/useAuth";
import { gql, useMutation } from "@apollo/client";

const IconButton = styled(MuiIconButton)`
  ${spacing};

  &:hover {
    background-color: transparent;
  }
`;

const AvatarBadge = styled(Badge)`
  margin-right: ${(props) => props.theme.spacing(1)};
  span {
    background-color: ${() => green[400]};
    border: 2px solid ${(props) => props.theme.palette.background.paper};
    height: 12px;
    width: 12px;
    border-radius: 50%;
  }
`;

function NavbarUserDropdown() {
  const [anchorMenu, setAnchorMenu] = React.useState<any>(null);
  const router = useRouter();
  const { user, userSignOut } = useAuth();
  const SIGNOUT_MUTATION = gql`
 mutation signout($token: String!) {
  signout(token: $token) {
    message
    success
  }
}
`;
const [signout, { loading, error }] = useMutation(SIGNOUT_MUTATION);
  const toggleMenu = (event: React.SyntheticEvent) => {
    setAnchorMenu(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorMenu(null);
  };

  const graphqSignOut= async()=>{
    const token = localStorage.getItem('token')
    const userToken = localStorage.getItem("userToken");
    try {
  //     const response = await fetch(`http://localhost:3000/api/graphql`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //   query: `
  //    mutation {
  //   signOut(
  //     token: "${token}" 
  //   ) 
  // }

  //   `,})
  // })
  const response = await signout({ variables: {  token: userToken  } });
  localStorage.removeItem("userToken");
  console.log(response,"signout000000000")
}catch(err){
  console.log(err)
}
  }

  const handleSignOut = async () => {
     await graphqSignOut();
    await userSignOut();
    router.push("/auth/sign-in");
  };

  return (
    <React.Fragment>
      <Tooltip title="Account">
        <IconButton
          aria-owns={anchorMenu ? "menu-appbar" : undefined}
          aria-haspopup="true"
          onClick={toggleMenu}
          color="inherit"
          p={0}
          mx={1}
        >
          <AvatarBadge
            overlap="circular"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            variant="dot"
          >
            {!!user && <Avatar alt={user.displayName} src={user.avatar} />}
            {/* Demo data */}
            {!user && (
              <Avatar
                alt="Lucy Lavender"
                src="/static/img/avatars/avatar-1.jpg"
              />
            )}
          </AvatarBadge>
        </IconButton>
      </Tooltip>
      <Menu
        id="menu-appbar"
        anchorEl={anchorMenu}
        open={Boolean(anchorMenu)}
        onClose={closeMenu}
      >
        <MenuItem onClick={closeMenu}>Profile</MenuItem>
        <MenuItem onClick={closeMenu}>Settings & Privacy</MenuItem>
        <Divider />
        <MenuItem onClick={closeMenu}>Help</MenuItem>
        <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
      </Menu>
    </React.Fragment>
  );
}

export default NavbarUserDropdown;
