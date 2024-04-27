import { useNavigate } from "react-router-dom";
import { Bottomwarning } from "../components/Bottomwarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { Inputbox } from "../components/Inputbox";
import { Subheading } from "../components/Subheading";
import { useState } from "react";
import axios from "axios";

export const Signin = ()=>{
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    return ( 
    <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 p-2 h-max pt-4 px-4">
                <div className="text-center">
                    <Heading label={"Sign In"} />
                    <Subheading description={"Enter your credentials to access your account"}/>
                </div>
                <Inputbox onChange={(e)=>{
                    setUserName(e.target.value);
                }} label={"Email"} placeholder={"johndoe@gmail.com"} />
                <Inputbox onChange={(e)=>{
                    setPassword(e.target.value);
                }} label={"Password"} placeholder={"johndoe@123"} />
                <div className="pt-4">
                    <Button onClick={async ()=>{
                        const response = await axios.post("http://localhost:3000/api/v1/user/signin",{
                            username,
                            password
                        });
                        localStorage.setItem("token", response.data.token);
                        navigate("/dashboard")
                    }} label={"Sign In"} />
                </div>
                <Bottomwarning label={"Don't have an Account?"} bottomText={"Sign Up"} to={"/signup"} />
            </div>
        </div>
    </div>
    );
}