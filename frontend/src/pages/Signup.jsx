import { useState } from "react"
import { Bottomwarning } from "../components/Bottomwarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { Inputbox } from "../components/Inputbox"
import { Subheading } from "../components/Subheading"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export const Signup = ()=>{
    const [firstname, setFirstName] =useState("");
    const [lastname, setLastName] = useState("");
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    return ( 
    <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 p-2 h-max pt-4 px-4">
                <div className="text-center">
                    <Heading label={"Sign Up"} />
                    <Subheading description={"Enter your information to create an Account"}/>
                </div>
                <Inputbox onChange={e =>{
                    setFirstName(e.target.value);
                }} label={"First Name"} placeholder={"John"} />
                <Inputbox onChange={e =>{
                    setLastName(e.target.value);
                }} label={"Last Name"} placeholder={"Doe"} />
                <Inputbox onChange={e =>{
                    setUserName(e.target.value);
                }} label={"Email"} placeholder={"johndoe@gmail.com"} />
                <Inputbox onChange={e =>{
                    setPassword(e.target.value);
                }} label={"Password"} placeholder={"johndoe@123"} />
                <div className="pt-4">
                    <Button onClick={async ()=>{
                        const response = await axios.post("http://localhost:3000/api/v1/user/signup",{
                            username,
                            password,
                            firstname,
                            lastname
                        });
                        localStorage.setItem("token", response.data.token);
                        navigate("/dashboard");
                    }} label={"Sign Up"} />
                </div>
                <Bottomwarning label={"Already have an Account?"} bottomText={"Sign In"} to={"/signin"}/ >
            </div>
        </div>
    </div>
    );
}