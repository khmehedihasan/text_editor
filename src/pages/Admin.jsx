import React from 'react';
import Demo1 from '../components/Demo1';
import Nav from '../components/Nav';

function Admin(){
    return(
        <>
            <Nav />
            <div className="editor">
                <Demo1 />
            </div>
        </>
    )
}

export default Admin;