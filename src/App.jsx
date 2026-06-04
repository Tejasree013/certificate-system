import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { QRCodeCanvas } from "qrcode.react";
import { supabase } from "./supabase";
import { FaPhoneAlt, FaEnvelope, FaGlobe } from "react-icons/fa";

// ✅ simple unique id generator


export default function App() {
  const certificateRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "",
    domain: "",
    startDate: "",
    endDate: "",
  });

  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateId, setCertificateId] = useState("");

  const issueDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

const handleGenerate = async () => {
  if (
    !formData.fullName ||
    !formData.domain ||
    !formData.startDate ||
    !formData.endDate
  ) {
    alert("Please fill all fields.");
    return;
  }

  const { data, error } = await supabase
    .from("certificates")
    .insert([
      {
        full_name: formData.fullName,
        internship_domain: formData.domain,
        start_date: formData.startDate,
        end_date: formData.endDate,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    alert("Failed to save certificate");
    return;
  }

  const dbId = data[0].id;

  const newId =
    "SNAAL2026" + String(dbId).padStart(4, "0");

const { error: updateError } = await supabase
  .from("certificates")
  .update({
    certificate_id: newId,
  })
  .eq("id", dbId);

if (updateError) {
  console.error(updateError);
  alert("Failed to update certificate ID");
  return;
}

  alert("Certificate saved successfully!");

  setCertificateId(newId);
  setShowCertificate(true);
};

  const downloadPDF = async () => {
    const input = certificateRef.current;
    if (!input) return;

    const canvas = await html2canvas(input, {
      scale: 3,
      useCORS: true,
      backgroundColor: null, // important when using image bg
      width: 1200,
      height: 850,
      windowWidth: 1200,
      windowHeight: 850,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [1200, 850],
    });

    pdf.addImage(imgData, "PNG", 0, 0, 1200, 850);
    pdf.save(`${formData.fullName}-certificate.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-200 py-10 px-4 flex flex-col items-center gap-6">
      {/* FORM */}
      {!showCertificate && (
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-6">Certificate Form</h1>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">Full Name</label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                className="mt-1 w-full border rounded-lg px-3 py-3 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Internship Domain</label>
              <input
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                placeholder="e.g., Python Developer"
                className="mt-1 w-full border rounded-lg px-3 py-3 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-lg px-3 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <br/>
              <div>
                <label className="text-sm font-semibold text-gray-700">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-lg px-3 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              className="mt-3 w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Generate Certificate
            </button>
          </div>
        </div>
      )}

      {/* CERTIFICATE */}
      {showCertificate && (
        <>
          <div
            ref={certificateRef}
            id="certificate"
            style={{
              position: "relative",
              width: "1200px",
              height: "850px",
              backgroundImage: "url(/template.png)", // ✅ your PNG
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              overflow: "hidden",
              borderRadius: "16px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            }}
          >
{/* CERTIFICATE ID HEADING */}
<div
  style={{
    position: "absolute",
    left: 60,
    top: 325,
    fontSize: 18,
    fontWeight: "700",
    color: "#0B2E7A",
    textTransform: "uppercase",
  }}
>
  CERTIFICATE ID
</div>

{/* CERTIFICATE ID VALUE */}
<div
  style={{
    position: "absolute",
    left: 60,
    top: 360,
    fontSize: 17,
    fontWeight: 700,
    color: "#0B2E7A",
  }}
>
  {certificateId}
</div>
<div
  style={{
    position: "absolute",
    left: 55,
    top: 400,
    width: "160px",
    height: "2px",
    backgroundColor: "#D4A017",
  }}
></div>

{/* VERIFICATION HEADING */}
<div
  style={{
    position: "absolute",
    left: 60,
    top: 420,
    fontSize: 18,
    fontWeight: "700",
    color: "#0B2E7A",
    textTransform: "uppercase",
  }}
>
  VERIFICATION
</div>

{/* VERIFICATION TEXT */}
<div
  style={{
    position: "absolute",
    left: 60,
    top: 455,
    width: "170px",
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#222",
  }}
>
  Scan the QR code to verify this certificate online.
</div>

            {/* ✅ CENTER NAME */}
<div
  style={{
    position: "absolute",
    top: "400px",
    left: "52%",
    transform: "translateX(-50%)",
    width: "700px",
    textAlign: "center",
    fontSize: "24px",
    lineHeight: "1.6",
    color: "#222",
    fontFamily: "Georgia, serif",
  }}
>
  This is to certify that{" "}
  
  <span
    style={{
      color: "#222",
      fontSize: "40px",
      fontWeight: "bold",
      fontStyle:"oblique",

    }}
  >
    {formData.fullName}
  </span>{" "}
  
  has successfully completed an internship in{" "}
  
  <span
    style={{
      color: "#0d275f",
      fontWeight: "bold",
      fontSize:"26px"
    }}
  >
    {formData.domain}
  </span>{" "}
  
  at <strong>SNAAL Info Pvt. Ltd.</strong> from{" "}
  
<strong>{formatDate(formData.startDate)}</strong> to{" "}

<strong>{formatDate(formData.endDate)}</strong>
  
  <br />
  

</div>

            {/* ✅ QR (inside box) */}
            <div style={{ position: "absolute", left: 45, top: 550 }}>
              <QRCodeCanvas
                value={`https://snaalinfo.in/verify?id=${certificateId}`}
                size={150}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
              />
            </div>

            {/* ✅ SIGNATURES */}
            <img
              src="/sign1.png"
              alt="sign1"
              style={{
                position: "absolute",
                left: 300,
                top: 579,
                height: 70,
                width: "auto",
                objectFit: "contain",
              }}
            />
            {/* SIGN 1 DETAILS */}
            <div
              style={{
                position: "absolute",
                left: 310,
                top: 660,
                width: "220px",
                textAlign: "center",
                color: "#0B2E7A",
              }}
            >
              <div style={{ fontWeight: "bold", fontSize: "17px" }}>
                DANDU SREEDHAR REDDY
              </div>

              <div style={{ fontSize: "14px", marginTop: "5px" ,color:"#222"}}>
                Founder and CEO
              </div>

              <div style={{ fontSize: "14px",color:"#222" }}>
                SNAAL Info Pvt. Ltd.
              </div>
            </div>

            <img
              src="/sign2.png"
              alt="sign2"
              style={{
                position: "absolute",
                left: 670,
                top:579,
                height: 70,
                width: "auto",
                objectFit: "contain",
                opacity: 0.9,
              }}
            />
            {/* SIGN 2 DETAILS */}
            <div
              style={{
                position: "absolute",
                left: 673,
                top: 655,
                width: "260px",
                textAlign: "center",
                color: "#0B2E7A",
              }}
            >
              <div style={{ fontWeight: "bold", fontSize: "18px" }}>
                DANDU HARIPRASAD REDDY
              </div>

              <div style={{ fontSize: "14px", marginTop: "5px",color:"#222" }}>
                Managing Director & Co-Founder
              </div>

              <div style={{ fontSize: "14px",color:"#222" }}>
                SNAAL Info Pvt. Ltd.
              </div>
            </div>

            {/* ✅ STAMP */}
            <img
              src="/stamp.png"
              alt="stamp"
              style={{
                position: "absolute",
                right: 40,
                bottom: 145,
                width: 150,
                height: 150,
                objectFit: "contain",
                 transform: "rotate(17deg)",
              }}
            />
{/* CONTACT INFO */}
<div
  style={{
    position: "absolute",
    left: 40,
    bottom: 25,
    display: "flex",
    gap: "50px",
    alignItems: "center",
    color: "#fff",
    fontSize: "13px",
    fontWeight: "500",
  }}
>
  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <FaPhoneAlt />
    <span>8464840592</span>
  </div>

  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <FaEnvelope />
    <span>snaalinfo@gmail.com</span>
  </div>

  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <FaGlobe />
    <span>www.snaalinfo.com</span>
  </div>
</div>
 {/* COMPANY ADDRESS */}
<div
  style={{
    position: "absolute",
    right: 80,
    bottom: 5,
    width: "400px",
    fontSize: "15px",
    color: "#222",
    lineHeight: "1.4",
    textAlign: "left",
  }}
>
  <div
    style={{
      fontWeight: "bold",
      fontSize: "16px",
      color: "#0B2E7A",
      marginBottom: "6px",
    }}
  >
    SNAAL INFO PVT. LTD.
  </div>

  <div>
    Building No. 03 BLOCK,WeWork India Management Pvt Ltd,<br />
    Manyata Techpark Road,Thanisandra, Embassy Manyata <br/>Business Park,Bengaluru, Karnataka - 560045
  </div>
</div>
          </div>


          <button
            onClick={downloadPDF}
            className="bg-green-600 text-white px-10 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
          >
            Download PDF
          </button>

          <button
            onClick={() => setShowCertificate(false)}
            className="text-sm text-blue-700 underline"
          >
            Back to Form
          </button>
        </>
      )}
    </div>
  );
}