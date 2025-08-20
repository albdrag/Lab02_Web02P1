// Procesar.tsx
import { useLocation } from "react-router-dom";
import DataTable from "react-data-table-component";

const Procesar = () => {
  const location = useLocation();
  const contenido = location.state?.contenido;

  if (!contenido || contenido.length === 0) return <p>No hay datos para mostrar</p>;

  let columns: any[] = [];
  let data: any[] = [];

  // Caso 1: Si viene con encabezado de papaparse => array de objetos
  if (!Array.isArray(contenido[0])) {
    const keys = Object.keys(contenido[0]);
    columns = keys.map((key) => ({
      name: key,
      selector: (row: any) => row[key],
      sortable: true,
    }));
    data = contenido.slice(0, 50);
  } 
  // Caso 2: Si no tenía encabezado => la primera fila son headers y lo demás arrays
  else {
    const headers = contenido[0];
    columns = headers.map((header: string) => ({
      name: header,
      selector: (row: any) => row[header],
      sortable: true,
    }));

    data = contenido.slice(1, 50).map((row: any) => {
      const obj: any = {};
      headers.forEach((header: string, idx: number) => {
        obj[header] = row[idx];
      });
      return obj;
    });
  }

  const customStyle = {
    rows: { style: { minHeight: "50px" } },
    headCells: { style: { paddingLeft: "8px", paddingRight: "8px", fontSize: "14px" } },
    cells: { style: { paddingLeft: "8px", paddingRight: "8px", fontSize: "14px" } },
  };

  return (
    <div className="container mt-4">
      <h4>Contenido del archivo</h4>

      <h5>Estructura de datos</h5>
      <table className="table table-striped">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 && (
            <tr>
              {columns.map((col, index) => (
                <td key={index}>{typeof data[0][col.name]}</td>
              ))}
            </tr>
          )}
        </tbody>
      </table>

      <h5>Conjunto de datos con DataTable</h5>
      <DataTable columns={columns} data={data} pagination selectableRows customStyles={customStyle} />
    </div>
  );
};

export default Procesar;
