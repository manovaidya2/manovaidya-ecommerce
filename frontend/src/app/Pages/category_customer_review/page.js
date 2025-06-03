import Head from 'next/head';
import '../category_customer_review/review.css';

export default function PatientStories() {
  return (
    <>
      <Head>
        <title>Patient Stories & Reviews | Manovaidya</title>
        <meta
          name="description"
          content="Real patient journeys, before-after recovery cases, and heartfelt video testimonials from Manovaidya."
        />
      </Head>

      <div className="patient-stories">
        <h1 className="title">Patient Stories & Reviews</h1>
        <p className="subtext">
          Real experiences from our patients - their challenges, recovery, and success.
        </p>

        {/* Before & After Cards with Embedded Videos */}
        <section className="before-after-cards">
          <div className="card before-card">
            <h3>Before Treatment</h3>
            <p>“I was overwhelmed with anxiety, and it felt like there was no way out.”</p>
            <p className="name">– Kavita R., Delhi</p>

            {/* YouTube Video */}
            <div className="video-review">
              <iframe
                width="100%"
                height="250"
                src="https://www.youtube.com/embed/73luAz1KSjE"
                title="Stress Can KILL! 💔 How Stress Leads to Heart Attacks & How to Stop It!"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
              <p>Understanding the stress before treatment</p>
            </div>

            {/* Local Video */}
            {/* <div className="video-review">
              <video controls poster="/assets/images/video-thumbnail.jpg">
                <source src="/assets/videos/review1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <p>Watch Kavita’s initial state and emotions</p>
            </div> */}
          </div>

          <div className="card after-card">
            <h3>After Treatment</h3>
            <p>“Now I feel confident, calm, and in control of my emotions every day.”</p>
            <p className="name">– Kavita R., Delhi</p>

            {/* YouTube Video */}
            <div className="video-review">
              <iframe
                width="100%"
                height="250"
                src="https://www.youtube.com/embed/nqye02H_H6I"
                title="How Therapy Changed My Life | Real Stories"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
              <p>Recovery and control after therapy</p>
            </div>

            {/* Local Video */}
            {/* <div className="video-review">
              <video controls poster="/assets/images/video-thumbnail.jpg">
                <source src="/assets/videos/review1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <p>Watch Kavita’s transformation after therapy</p>
            </div> */}
          </div>
        </section>
      </div>
    </>
  );
}
