import React from 'react'
import {Navigate} from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute=({children,allowedRoles})=>{
    const {roles}=useSelector((state)=>state.auth)

    if(!roles?.some((role)=>allowedRoles.includes(role))){
        return <Navigate to='/'/>
    }
    return children
}

export default ProtectedRoute