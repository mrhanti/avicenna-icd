import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [symptoms, setSymptoms] = useState(
    "cough, sexual dysfunction, high blood pressure"
  );
  const [result, setResult] = useState();
  const [age, setAge] = useState(1);
  const [gender, setGender] = useState("male");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ entries: symptoms, age, gender }),
    });
    const data = await response.json();
    try {
      setResult(data.result);
      // setSymptoms("");
      setLoading(false);
    } catch (err) {
      console.log(data);
      setLoading(false);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <h3>Generate ICD-10 codes</h3>
        <form onSubmit={onSubmit}>
          <div className={styles.row}>
            <div className={styles.col}>
              <label>Age</label>
              <input
                type="number"
                placeholder="Patient age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div className={styles.col}>
              <label>Gender</label>
              <select
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <hr />
          <label>Symptoms</label>
          <textarea
            rows={10}
            name="symptoms"
            placeholder="Add entries"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />
          <input
            type="submit"
            disabled={loading}
            value="Generate ICD-10 codes"
          />
        </form>
        {Array.isArray(result) && (
          <div className={styles.result}>
            {result.map((item) => (
              <div key={item.id}>
                {item.code} {item.desc}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
