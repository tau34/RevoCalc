const OutputTable: React.FC<{ data: { label: string; value: string; color?: string, textColor?: string }[] }> = ({ data }) => {
  return (
    <table style={{ margin: "20px auto", borderCollapse: "separate", borderSpacing: "0" }}>
      <tbody>
        {data.map((row, index) => (
          <tr key={index} style={{ backgroundColor: row.color || "#f9fafb" }}>
            <td style={{ color: row.textColor || "#000", 
              WebkitTextStroke: row.textColor ? "0.5px #000" : "none", 
              fontWeight: "bold",
              width: "250px", padding: "8px 0" }}
            >{row.label}</td>
            <td style={{ color: "#000", width: "250px", padding: "8px 0" }}>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OutputTable;