import React, {useEffect} from 'react';
import {Header} from '../components/header';
import {LoginForm} from '../components/login-form';
import {useStoreMap} from 'effector-react';
import {$tokenData} from '../effector/users.store.ts';
import { Navigate } from 'react-router-dom';

export function Login() {
    const isAuthorized = useStoreMap($tokenData, (state) => !!state.accessToken) 

    if (isAuthorized) {
        return <Navigate to="/" />
    }

    return (
        <>
            <Header />
            <LoginForm />
        </>
    )
}
