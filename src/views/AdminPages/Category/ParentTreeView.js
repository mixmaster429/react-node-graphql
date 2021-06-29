import React from 'react';


const ParentTreeView = ({data}) => ( 
    <>
      {data && data.map(item => (
        <>
        <li>
          {item.valueParent} { `-` } {item && item.valueChild && (item.valueChild.map(z  => z)).join(" | ")}
        </li>
        </>
      ))}
    
    </>
  );

  export default ParentTreeView