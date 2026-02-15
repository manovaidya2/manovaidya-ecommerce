// "use client";
// import image from "../../Images/mind-health-img.png";
// import Image from "next/image";
// import "./mindHealth.css";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { postData } from "@/app/services/FetchNodeServices";
// import { Parser } from "html-to-react";
// const Page = () => {
//   const [testData, setTestData] = useState([])

//   const fetchTests = async () => {
//     const response = await postData('api/test/get-mind-test');
//     console.log("XXXX", response);
//     if (response.status === true) {
//       setTestData(response.data.reverse());
//     }
//   }

//   useEffect(() => {
//     fetchTests()
//   }, [])

//   return (
//     <>
//       <section className="mind-health-test">
//         <div className="container">
//           <div className="row align-items-center">
//             <div className="col-md-9">
//               <h4>MENTAL HEALTH SELF TEST</h4>
//               <p>
//                 Understanding your <b> mental well-being</b> is the first step
//                 toward a healthier, more balanced life. Our self-tests are
//                 designed to help you <b> gain insights into your emotions,</b>{" "}
//                 thoughts, and behaviors. These assessments allow you to explore
//                 specific areas of mental health, such as stress, anxiety, focus,
//                 or sleep issues, helping you <b> identify patterns</b> that may
//                 need attention. Whether you’re experiencing challenges in daily
//                 life or simply want to understand yourself better, these tests
//                 can be a <b> helpful guide.</b>
//               </p>
//               <p>
//                 <b>Disclaimer:</b> These self-tests are intended to provide
//                 insights into your mental health and are not a substitute for
//                 professional diagnosis or treatment. For a full evaluation or if
//                 you have concerns about your mental health, please consult a
//                 licensed mental health professional or physician.
//               </p>
//             </div>
//             <div className="col-md-3">
//               <div className="health-mind-image">
//                 <Image src={image} alt="health mind image" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <section className="mind-health-test-cards">
//         <div className="container">
//           <div className="text-center">
//             <h2>
//               Select Your Mental Health Test Area
//             </h2>
//           </div>
//           <hr />
//           <div className="row">
//             {testData.map((test, index) => (
//               <div className="col-12 col-sm-6 col-md-4 mb-3" key={index}>
//                 <div
//                   data-aos="fade-up"
//                   className="health-test-card-main"
//                   style={{ backgroundColor: test.themeColor, color: "white" }} // Set the font color to white
//                 >
//                   <div className="card-body">
//                     <Link href={`/Pages/mental-health-test/${test?._id}`} style={{ color: "white" }}>
//                       <h5 className="card-title">{test?.addHeaderTitle}</h5>
//                       <p className="card-text">{Parser().parse(test?.keyPoint)}</p> {/* Ensure Parser() is used correctly */}
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default Page;








"use client";

import { useState } from "react";
import "./mindHealth.css";

const questions = [
  {
    title: "How would you describe the severity of your symptoms?",
    options: [
      "Mild - Occasional discomfort",
      "Moderate - Regular impact on daily life",
      "Severe - Significantly affects daily functioning",
    ],
  },
  {
    title: "How long have you been experiencing these symptoms?",
    options: ["Less than 1 month", "1-6 months", "More than 6 months"],
  },
  {
    title: "How many mental health concerns do you have?",
    options: [
      "One specific concern",
      "Two related concerns",
      "Multiple overlapping concerns",
    ],
  },
  {
    title: "What is your primary concern?",
    options: [
      "Stress & Anxiety",
      "Sleep Issues / Insomnia",
      "Desire & Intimacy Concerns",
      "Focus & Concentration Issues",
      "Overall Mental Wellness",
    ],
  },
  {
    title: "What is your main goal?",
    options: [
      "Build mental resilience & prevent issues",
      "Manage existing mild symptoms",
      "Comprehensive treatment for severe condition",
    ],
  },
];

// 🔗 Redirect URLs
const redirectMap = {
  "Stress & Anxiety":
    "https://manovaidya.com/Pages/products/681b31b1499082ac943eadec",

  "Sleep Issues / Insomnia":
    "https://manovaidya.com/Pages/products/681af884b851bfc60591b9dc",

  "Desire & Intimacy Concerns": [
    "https://manovaidya.com/Pages/products/681af7a3b851bfc60591b85f",
    "https://manovaidya.com/Pages/products/681af67cb851bfc60591b6ed",
  ],

  "Focus & Concentration Issues":
    "https://manovaidya.com/Pages/products/681af37cb851bfc60591b142",

  "Overall Mental Wellness":
    "https://manovaidya.com/Pages/products/681af37cb851bfc60591b142",
};

export default function AssessmentPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const progressPercent = ((step + 1) / questions.length) * 100;

  const handleFinalSubmit = () => {
    const severity = answers[0]; // Mild / Moderate / Severe
    const concern = answers[3];  // Primary Concern

    // 🚨 Severe → Clinic Redirect
    if (severity?.includes("Severe")) {
      window.location.href =
        "https://manovaidya.com/Pages/clinic";
      return;
    }

    // ✅ Mild / Moderate → Product Redirect
    const redirect = redirectMap[concern];

    if (Array.isArray(redirect)) {
      // Random product for Desire & Intimacy
      const randomLink =
        redirect[Math.floor(Math.random() * redirect.length)];
      window.location.href = randomLink;
    } else if (redirect) {
      window.location.href = redirect;
    }
  };

  return (
    <div className="assessment-wrapper">
      <div className="assessment-card">
        <h1>Mental Health Assessment</h1>
        <p className="subtitle">
          Answer a few questions to get personalized recommendations
        </p>

        <p className="step-text">
          Question {step + 1} of {questions.length}
        </p>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <h2 className="question">{questions[step].title}</h2>

        <div className="options">
          {questions[step].options.map((opt) => (
            <label
              key={opt}
              className={`radio-option ${
                answers[step] === opt ? "active" : ""
              }`}
            >
              <input
                type="radio"
                name={`question-${step}`}
                value={opt}
                checked={answers[step] === opt}
                onChange={() =>
                  setAnswers({ ...answers, [step]: opt })
                }
              />
              <span className="custom-radio" />
              <span className="option-text">{opt}</span>
            </label>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="nav-buttons">
          {step > 0 && (
            <button className="back" onClick={() => setStep(step - 1)}>
              Back
            </button>
          )}

          {step < questions.length - 1 ? (
            <button
              className="next"
              disabled={!answers[step]}
              onClick={() => setStep(step + 1)}
            >
              Next
            </button>
          ) : (
            <button
              className="submit"
              disabled={!answers[step]}
              onClick={handleFinalSubmit}
            >
              Get Results
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
