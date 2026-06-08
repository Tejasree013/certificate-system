import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "./supabase";

export default function Verify() {
  const [searchParams] = useSearchParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificate = async () => {
      const id = searchParams.get("id");

      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("certificate_id", id)
        .single();

      if (!error) {
        setCertificate(data);
      }

      setLoading(false);
    };

    fetchCertificate();
  }, [searchParams]);

  if (loading) return <h2>Loading...</h2>;

if (!certificate) {
  return (
<div
  style={{
    minHeight: "100vh",
    background: "#f5f7fb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  }}
>
      <h1>❌ Invalid Certificate</h1>
    </div>
  );
}

  return (
  <div
    style={{
      minHeight: "100vh",
      background: "#ffffff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
    }}
  >
    
<div
  style={{
    background: "#ffffff",
    color: "#222",
    maxWidth: "900px",
    width: "100%",
    padding: "40px",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 15px 50px rgba(255,255,255,0.12)",
    lineHeight: "1.9",
  }}
>
      <h2
        style={{
          color: "#16a34a",
          marginBottom: "30px",
          fontSize: "34px",
          fontWeight: "700",
        }}
      >
        ✅ Certificate Successfully Verified
      </h2>

      <p style={{ fontSize: "20px", marginBottom: "12px" }}>
        <strong>Certificate Holder:</strong>{" "}
        {certificate.full_name}
      </p>

      <p style={{ fontSize: "20px", marginBottom: "12px" }}>
        <strong>Certificate ID:</strong>{" "}
        {certificate.certificate_id}
      </p>

      <p style={{ fontSize: "20px", marginBottom: "12px" }}>
        <strong>Internship Program:</strong>{" "}
        {certificate.internship_domain}
      </p>

      <p style={{ fontSize: "20px", marginBottom: "12px" }}>
        <strong>Organization:</strong>{" "}
        SNAAL INFO PVT. LTD.
      </p>

      <p style={{ fontSize: "20px", marginBottom: "12px" }}>
        <strong>Duration:</strong>{" "}
        {new Date(certificate.start_date).toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }
        )}
        {" – "}
        {new Date(certificate.end_date).toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }
        )}
      </p>

      <p style={{ fontSize: "20px", marginBottom: "12px" }}>
        <strong>Status:</strong>{" "}
        Successfully Completed
      </p>

      <p style={{ fontSize: "20px", marginBottom: "12px" }}>
        <strong>Verification Status:</strong>{" "}
        <span style={{ color: "#4ade80" }}>
          Authentic and Valid
        </span>
      </p>

      <br />

<p
  style={{
    color: "#555",
    fontSize: "15px",
    lineHeight: "1.8",
  }}
>
        This certificate has been digitally issued and
        verified by SNAAL INFO PVT. LTD. Any unauthorized
        modification invalidates this certification.
      </p>

      <div style={{ marginTop: "30px" }}>
        <a
          href="https://snaalinfo.com"
          target="_blank"
          rel="noopener noreferrer"
        style={{
          background: "#2563eb",
          color: "#fff",
          padding: "12px 24px",
          borderRadius: "10px",
          textDecoration: "none",
          fontWeight: "600",
          display: "inline-block",
          boxShadow: "0 4px 12px rgba(37,99,235,0.25)",
        }}
        >
          🌐 Visit SNAAL Website
        </a>
      </div>
    </div>
  </div>
);
}