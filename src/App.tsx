// App.tsx
import React, { useState } from "react";
import { usePapaParse } from "react-papaparse";
import { useNavigate } from "react-router-dom";
import { Container, Paper, Typography, Button, TextField, FormControlLabel, Checkbox } from "@mui/material";

const App: React.FC = () => {
  const { readString } = usePapaParse();
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [delimiter, setDelimiter] = useState(";");
  const [hasHeader, setHasHeader] = useState(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;

      readString(csv, {
        delimiter: delimiter,
        header: hasHeader,
        dynamicTyping: true,
        complete: (result: any) => {
          let data = result.data;

          // Si no hay encabezado, creamos uno automático
          if (!hasHeader) {
            const numColumns = data[0]?.length || 0;
            const headers = Array.from({ length: numColumns }, (_, i) => `Columna_${i + 1}`);
            data = data.map((row: any) => {
              const obj: any = {};
              row.forEach((value: any, idx: number) => {
                obj[headers[idx]] = value;
              });
              return obj;
            });
            data = [headers, ...data]; // agregamos los encabezados al inicio para Procesar.tsx
          }

          console.log("Datos procesados:", data);
          navigate("/procesar", { state: { contenido: data } });
        },
      });
    };

    reader.readAsText(file);
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "20px" }}>
      <Paper elevation={3} style={{ padding: "20px" }}>
        <Typography variant="h5" gutterBottom align="center">
          Lectura de archivos CSV
        </Typography>

        <div style={{ marginBottom: "10px" }}>
          <input type="file" accept=".csv" onChange={handleFileChange} />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <TextField
            label="Separador"
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            inputProps={{ maxLength: 1 }}
            fullWidth
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <FormControlLabel
            control={<Checkbox checked={hasHeader} onChange={(e) => setHasHeader(e.target.checked)} />}
            label="El archivo tiene encabezado"
          />
        </div>

        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
          Procesar CSV
        </Button>
      </Paper>
    </Container>
  );
};

export default App;
