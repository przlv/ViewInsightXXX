import React from "react";
import { NavLink } from "react-router-dom";

import './Header.css';
import logo from '../../assets/logo.png';

export default function Header() {

    return (
        <header>
            <div className="logo-header">
                <img className="logo" src={logo} alt="second..."/>
                <i className="logo-text">ViewInsightX</i>
            </div>
            <ul className="NavigationMenu">
                {/*<li>*/}
                {/*    <NavLink to="/graphs">Графики</NavLink>*/}
                {/*</li>*/}
                <li>
                    <NavLink to="/dataview">Данные</NavLink>
                </li>
                {/*<li>*/}
                {/*    <NavLink to="/settings">Настройки</NavLink>*/}
                {/*</li>*/}
            </ul>
        </header>
    )
}
