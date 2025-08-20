import React from "react";
import { useForm } from "react-hook-form";
import { Container, Paper, Typography, Button, TextField, Grid } from "@mui/material";
import { usePapaParse } from "react-papaparse";
import { useNavigate } from "react-router-dom";

interface FormData {
  txtArchi: FileList;
  delimiter: string;
}

const App: React.FC = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const { readString } = usePapaParse();
  const navigate = useNavigate();

  const onSubmit = (data: FormData) => {
    if (!data.txtArchi || data.txtArchi.length === 0) return;

    const archivo = data.txtArchi[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const delimiter = data.delimiter || ";";

      readString(csv, {
        delimiter,
        header: false,
        dynamicTyping: true,
        complete: (result: any) => {
          console.log("Datos procesados:", result.data);
          navigate("/procesar", { state: { contenido: result.data } });
        },
      });
    };

    reader.readAsText(archivo);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "20px" }}>
      <Paper elevation={3} style={{ padding: "20px" }}>
        <Typography variant="h5" gutterBottom align="center">
          Lectura de archivos CSV
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} direction="column">
            <Grid>
              <input
                {...register("txtArchi", { required: true })}
                type="file"
                accept=".csv"
                style={{ width: "100%", padding: "5px", fontSize: "13px" }}
              />
            </Grid>

            <Grid>
              <TextField
                {...register("delimiter", { required: true })}
                label="Separador"
                defaultValue=";"
                inputProps={{ maxLength: 1 }}
                fullWidth
              />
            </Grid>

            <Grid>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Procesar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default App;
