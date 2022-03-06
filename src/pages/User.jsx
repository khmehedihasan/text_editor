import React, { useEffect, useState } from 'react';
import Nav from '../components/Nav';

function User(){
    const [data, setData] = useState([]);
    useEffect(()=>{
        fetch('https://text1-api.herokuapp.com/text').then((data)=>data.json()).then((data)=>setData(data));
    },[]);



    return(
        <>
            <Nav />
            <div >
                {
                    data.map((data,index)=>{
                         return(<div key={index} className='show' dangerouslySetInnerHTML={{ __html: data.value }}></div>)
                    })
                }
                
            </div>
        </>
    )
}

export default User;