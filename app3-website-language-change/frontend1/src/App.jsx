import React from 'react'
import { useTranslation } from 'react-i18next';

const App = () => {
    const { t, i18n } = useTranslation();
    const language = i18n.resolvedLanguage || "en";


    return (
        <div style={{ padding: "30px" }}>
            <h1>React website language change</h1>
            <label htmlFor="language">Language </label>
            <select name="language" id="language" value={language} onChange={event => i18n.changeLanguage(event.target.value)}>
                <option value={"en"}>English</option>
                <option value={"hi"}>Hindi</option>
            </select>
            <hr />
            <div style={{ display: "flex", gap: "100px" }}>
                <div>
                    <h1>Original</h1>
                    <h3>Welcome</h3>
                    <h3>Home</h3>
                    <h3>About Us</h3>
                    <h3>Contact Us</h3>
                    <h3>Delete this</h3>
                    <h3>Cancel this</h3>
                </div>
                <div>
                    <h1>Changed</h1>
                    <h3>{t("welcome")}</h3>
                    <h3>{t("home")}</h3>
                    <h3>{t("about")}</h3>
                    <h3>{t("contact")}</h3>
                    <h3>{t("delete")}</h3>
                    <h3>{t("cancel")}</h3>
                </div>
            </div>
        </div>
    )
}

export default App

