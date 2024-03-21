function Info({ features }) {
    if (!features || features.length === 0) {
      return <div>Данні відсутні</div>;
    }
  console.log('features', features)

  // const featuresArray = JSON.parse(features);
    return (
      // <table style={{borderCollapse:'collapse'}}>
      //   <thead>
      //     <tr>
      //       {Object.keys(features[0].properties).map((value, index) => (
      //         <th key={index}>{value}</th>
      //       ))}
      //     </tr>
      //   </thead>
      //   <tbody>
      //     {features.map((value, index) => (
      //       <tr key={index}>
      //         {Object.values(value.properties).map((value, index) => (
      //           <td key={index}>{value}</td>
      //         ))}
      //       </tr>
      //     ))}
      //   </tbody>
      // </table>
      
      <div dangerouslySetInnerHTML={{ __html: features }} />
      // <div>{JSON.stringify(features.features[0]?.properties)}</div>
    );
  }
  

export default Info