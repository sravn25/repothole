import React from "react";
import { createStyles, Navbar, Text, Flex } from "@mantine/core";
import potholeIcon from "../images/pothole.png";

const useStyles = createStyles((theme) => ({
  nav: {
    borderRight: "1px solid gray",
    backgroundColor: "lightgray",
  },

  navHeader: {
    borderBottom: "1px solid gray",
  },
}));

const Nav = () => {
  const { classes } = useStyles();
  return (
    <Navbar
      width={{ sm: "15vw", lg: "20vw", base: 100 }}
      withBorder
      className={classes.nav}
    >
      <Navbar.Section className={classes.navHeader}>
        <Flex align="center" p="md" direction={{ base: "column", sm: "row" }}>
          <img src={potholeIcon} width={50} height={50} alt="header logo" />
          <Text
            fz={{ md: "md", lg: "lg", base: "xs" }}
            fw={700}
            sx={{ fontFamily: "Architects Daughter" }}
          >
            RepotHole
          </Text>
        </Flex>
      </Navbar.Section>
      <Navbar.Section grow mt="md">
        Links
      </Navbar.Section>
      <Navbar.Section>Sign In</Navbar.Section>
    </Navbar>
  );
};

export default Nav;
