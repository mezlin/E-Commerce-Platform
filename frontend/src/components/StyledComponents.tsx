import { styled } from "@mui/material/styles";
import { Container, Box, Paper } from "@mui/material";

export const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

export const GridContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: theme.spacing(3),
  padding: theme.spacing(2),
}));

export const AnimatedPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 12,
  boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0px 8px 16px rgba(0,0,0,0.1)",
  },
}));

export const FormContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  maxWidth: 400,
  margin: "0 auto",
  padding: theme.spacing(3),
}));
