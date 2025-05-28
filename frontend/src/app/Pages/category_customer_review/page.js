import Head from 'next/head';
import '../category_customer_review/review.css';



export default function PatientStories() {
  return (
    <>
      <Head>
        <title>Patient Stories & Reviews | Manovaidya</title>
        <meta name="description" content="Real patient journeys, before-after recovery cases, and heartfelt video testimonials from Manovaidya." />
      </Head>

      <div className="patient-stories">
        <h1 className="title">Patient Stories & Reviews</h1>
        <p className="subtext">Real experiences from our patients - their challenges, recovery, and success.</p>

        {/* Before & After Cards */}
        <section className="before-after-cards">
          <div className="card before-card">
            <h3>Before Treatment</h3>
            <p>“I was overwhelmed with anxiety, and it felt like there was no way out.”</p>
            <img src="/assets/images/before1.jpg" alt="Before" />
            <p className="name">– Kavita R., Delhi</p>
          </div>

          <div className="card after-card">
            <h3>After Treatment</h3>
            <p>“Now I feel confident, calm, and in control of my emotions every day.”</p>
            <img src="/assets/images/after1.jpg" alt="After" />
            <p className="name">– Kavita R., Delhi</p>
          </div>
        </section>

        {/* Video Section */}
        <section className="video-review-section">
          <h2>Before & After – Video Review</h2>
          <div className="video-card">
            <video controls poster="/assets/images/video-thumbnail.jpg">
              <source src="/assets/videos/review1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p>Watch Kavita’s transformation journey with Manovaidya</p>
          </div>
        </section>
      </div>
    </>
  );
}
