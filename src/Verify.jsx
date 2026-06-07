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
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>❌ Invalid Certificate</h1>
      </div>
    );
  }

  return (
  <div style={{ padding: "40px" }}>
    <h1>✅ Certificate Verified</h1>

    <p><strong>Name:</strong> {certificate.full_name}</p>
    <p><strong>Certificate ID:</strong> {certificate.certificate_id}</p>
    <p><strong>Domain:</strong> {certificate.internship_domain}</p>
    <p><strong>Start Date:</strong> {certificate.start_date}</p>
    <p><strong>End Date:</strong> {certificate.end_date}</p>

    <p
      style={{
        color: "green",
        fontWeight: "bold",
        marginTop: "20px",
      }}
    >
      This certificate has been successfully verified by
      SNAAL INFO PVT. LTD.
    </p>

    <div style={{ marginTop: "30px" }}>
      <a
        href="https://snaalinfo.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          backgroundColor: "#0d6efd",
          color: "#fff",
          padding: "12px 24px",
          textDecoration: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          display: "inline-block",
        }}
      >
        🌐 Visit SNAAL Website
      </a>
    </div>
  </div>
);
}