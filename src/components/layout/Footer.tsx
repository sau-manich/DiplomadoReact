import { Box, Typography } from "@mui/material";

interface Props {
  message: string
}

export const Footer = ({message}: Props) => {
  return (
    <Box
      sx={{
        bgcolor: 'grey.500',
        color: 'white',
        py: 1,
        textAlign: 'center',
        zIndex: 10
      }}
    >
      <Typography variant="body2">{message}</Typography>
    </Box>
  );
};
