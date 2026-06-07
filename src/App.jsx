import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { QRCodeCanvas } from "qrcode.react";
import { supabase } from "./supabase";



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
    await document.fonts.ready;
    const canvas = await html2canvas(input, {
      scale: 2,
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
    top: 375,
    fontSize: 18,
    fontWeight: "700",
    color: "#082B66",
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
    top: 410,
    fontSize: 17,
    fontWeight: 700,
    color: "#082B66",
  }}
>
  {certificateId}
</div>

{/* COMPANY LOGO */}
<img
  src="/company.png"
  alt="company"
  style={{
    position: "absolute",
  top: 62,
left: 60,
width: 170,
    height: "auto",
  }}
/>

{/* AICTE */}
<img
  src="/aicte.png"
  alt="aicte"
  style={{
    position: "absolute",
    top: 70,
left: 640,
width: 95,
    height: "auto",
  }}
/>

{/* ISO */}
<img
  src="/iso.png"
  alt="iso"
  style={{
    position: "absolute",
    top: 71,
    left: 747,
    width: 115,
    height: "auto",
  }}
/>

{/* APSCHE */}
<img
  src="/apsche.png"
  alt="apsche"
  style={{
    position: "absolute",
    top: 82,
left: 880,
width: 110,
    height: "auto",
  }}
/>

{/* MSME */}
<img
  src="/msme.png"
  alt="msme"
  style={{
    position: "absolute",
    top: 82,
left: 1020,
width: 145,
    height: "auto",
  }}
/>
<div
  style={{
    position: "absolute",
    top: "180px",
    left: "51%",
    transform: "translateX(-50%)",
    fontSize: "62px",
    fontWeight: "700",
    color: "#082B66",
    letterSpacing: "5px",
    fontFamily: "Georgia, serif",
  }}
>
  CERTIFICATE
</div>
<div
  style={{
    position: "absolute",
    top: "290px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  }}
>
  <div
    style={{
      width: "120px",
      height: "2px",
      background: "#C89B3C",
    }}
  />

  <span
    style={{
      fontSize: "22px",
      fontWeight: "700",
      letterSpacing: "3px",
      color: "#000000",
      fontFamily: "Georgia, serif",
    }}
  >
    OF COMPLETION
  </span>

  <div
    style={{
      width: "120px",
      height: "2px",
      background: "#C89B3C",
    }}
  />
</div>
<div
  style={{
    position: "absolute",
    top: "330px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "32px",
    fontWeight: "700",
    letterSpacing: "2px",
    color: "#1E3F78",
    fontFamily: "Georgia, serif",
  }}
>
  SNAAL INFO PVT. LTD.
</div>
<div
  style={{
    position: "absolute",
    top: "380px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "16px",
    fontStyle: "italic",
    letterSpacing: "2px",
    color: "#333",
    fontFamily: "Georgia, serif",
  }}
>
  "Where Growth Begins"
</div>
{/* <div
  style={{
    position: "absolute",
    left: 55,
    top: 600,
    width: "160px",
    height: "2px",
    backgroundColor: "#C89B3C",
  }}
></div> */}
{/* <div
  style={{
    position: "absolute",
    left: 60,
    top: 455,
    width: "160px",
    height: "1px",
    background: "#C89B3C"
  }}
></div> */}
{/* VERIFICATION HEADING */}
<div
  style={{
    position: "absolute",
    left: 60,
    top: 475,
    fontSize: 18,
    fontWeight: "700",
    color: "#082B66",
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
    top: 510,
    width: "140px",
    fontSize: "12px",
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
    top: "415px",
    left: "55%",
    transform: "translateX(-50%)",
    width: "780px",
    textAlign: "left",
    fontSize: "16px",
    lineHeight: "1.8",
    color: "#222",
    fontFamily: "Georgia, serif",
  }}
>
  This is to certify that{"  "}
  
<span
  style={{
    fontSize: "28px",
    fontWeight: "400",
    fontFamily: "Georgia, serif",
    color: "#000",
    marginLeft: "10px",
    marginRight: "10px",
    verticalAlign: "-2px"
  }}
>
    {formData.fullName}
  </span>&nbsp;
  
      has successfully completed an internship in{" "}
  <br/>
<span
  style={{
    fontSize: "18px",
    fontWeight: "700",
    lineHeight:"1",
    color: "#082B66"
  }}
>
  {formData.domain}
</span>

{" "}at{" "}
<strong>SNAAL Info Pvt. Ltd.</strong>
{" "}from{" "}
  
<strong>{formatDate(formData.startDate)}</strong> to{" "}

<strong>{formatDate(formData.endDate)}</strong>

<br/>
<span
  style={{
    display: "block",
    marginTop: "3px",
    fontSize: "16px",
    lineHeight: "1.8",
    color: "#333",
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
  }}
>
  During this internship, the intern demonstrated strong technical
  skills, dedication, and a proactive learning attitude while
  contributing effectively to development projects.
</span>

</div>

            {/* ✅ QR (inside box) */}
            <div style={{ position: "absolute", left: 60, top: 600 }}>
              <QRCodeCanvas
                value={`https://certificate-system-theta.vercel.app/verify?id=${certificateId}`}
                size={120}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
              />
            </div>
            <div
             style={{
              position: "absolute",
              left: 645,
              top: 620,
              width: "2px",
              height: "110px",
              background: "#C89B3C"
                }}
            ></div>
            {/* ✅ SIGNATURES */}
            <img
              src="/sign1.png"
              alt="sign1"
              style={{
                position: "absolute",
                left: 375,
                top: 585,
                height: 45,
                width: "auto",
                objectFit: "contain",
              }}
            />
            {/* SIGN 1 DETAILS */}
            <div
              style={{
                position: "absolute",
                left: 350,
                top: 630,
                width: "220px",
                textAlign: "center",
                color: "#082B66",
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
                left: 755,
                top: 590,
                height: 45,
                width: "auto",
                objectFit: "contain",
                opacity: 0.9,
              }}
            />
            {/* SIGN 2 DETAILS */}
<div
  style={{
    position: "absolute",
    left: 715,
    top: 630,
    width: "260px",
    textAlign: "center",
    color: "#082B66",
  }}
>
  <div style={{ fontWeight: "bold", fontSize: "18px" }}>
    DANDU HARIPRASAD REDDY
  </div>

  <div
    style={{
      fontSize: "14px",
      marginTop: "5px",
      color: "#222",
    }}
  >
    Managing Director & Co-Founder
  </div>

  <div
    style={{
      fontSize: "14px",
      color: "#222",
    }}
  >
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
                bottom: 155,
                width: 115,
                height: 115,
                objectFit: "contain",
                 transform: "rotate(19deg)",
              }}
            />

{/* CONTACT INFO */}
<div
  style={{
    position: "absolute",
    left: 25,
    bottom: 25,
    display: "flex",
    gap: "40px",
    alignItems: "center",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "500",
    lineHeight: "1",
  }}
>
<span>🕾 8464840592</span>
<span>✉ snaalinfo@gmail.com</span>
<span>🔗 snaalinfo.com</span>
</div>
 {/* COMPANY ADDRESS */}
<div
  style={{
    position: "absolute",
    right: 60,
    bottom: 12,
    width: "400px",
    fontSize: "13px",
    color: "#222",
    lineHeight: "1.4",
    textAlign: "left",
  }}
>
  <div
    style={{
      fontWeight: "bold",
      fontSize: "18px",
      color: "#082B66",
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
