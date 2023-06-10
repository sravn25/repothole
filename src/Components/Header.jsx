import { useState, useEffect } from "react";
import {
  createStyles,
  Header,
  Container,
  Group,
  Button,
  Text,
  rem,
  Image,
} from "@mantine/core";
import logo from "../images/Logo.png";
import { Link, useLocation } from "react-router-dom";

const HEADER_HEIGHT = rem(60);

const useStyles = createStyles((theme) => ({
  inner: {
    height: HEADER_HEIGHT,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    textDecoration: "none",
    color: "white",
    display: "flex",
  },
  link: {
    textDecoration: "none",
    color: "white",
  },
}));

export function HeaderAction() {
  const { classes } = useStyles();

  const [dashboard, setDashboard] = useState(false); // view set to dashboard or not
  const location = useLocation(); // current route path

  useEffect(() => {
    location.pathname === "/" ? setDashboard(false) : setDashboard(true);
  }, [location]); // checks if in dashboard or not

  return (
    <Header
      height={HEADER_HEIGHT}
      sx={{ borderBottom: "1px solid #2f2f2f" }}
      mb={0}
    >
      <Container className={classes.inner} fluid>
        <Group>
          <Link to={"/"} className={classes.logo}>
            <Image src={logo} height={30} width={30} />
            <Text
              fz={{ md: "md", lg: "lg", base: "xs" }}
              fw={700}
              sx={{ fontFamily: "Architects Daughter" }}
            >
              RepotHole
            </Text>
          </Link>
        </Group>
        <Button radius="xl" h={30}>
          <Link to={!dashboard ? "/admin" : "/"} className={classes.link}>
            {!dashboard ? <span>Dashboard</span> : <span>Return</span>}
          </Link>
        </Button>
      </Container>
    </Header>
  );
}
