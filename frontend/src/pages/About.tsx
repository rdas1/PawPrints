import SleepyFooter from "@/components/SleepyFooter";

export default function About() {
    return (
      <div className="px-4 py-8 max-w-4xl mx-auto text-white space-y-6">
        <h1 className="text-3xl font-bold font-display">About PawPrints</h1>
  
        <p className="text-lg leading-relaxed">
          <strong>PawPrints</strong> is a portfolio project designed to demonstrate how I would approach designing and building a CRUD application for veterinary professionals and animal care teams.
        </p>
  
        <p className="text-lg leading-relaxed">
          It supports key functionality such as:
        </p>
  
        <ul className="list-disc list-inside text-lg space-y-1">
          <li>Managing animal records and metadata</li>
          <li>Adding and editing animal types inline</li>
          <li>Filtering, sorting, and pagination</li>
          <li>Modern UI/UX with mobile-friendly design</li>
          <li>Responsive modals for creation and editing</li>
          <li>Visual feedback with cute animations</li>
        </ul>
  
        <p className="text-lg leading-relaxed">
          This app is built using React, TypeScript, Tailwind CSS, and ShadCn, with a focus on accessibility, responsiveness, and visual polish. The backend uses Node.js, Express, and SQLite, with a RESTful API for data management. It is hosted on an EC2 instance.
        </p>

        <p className="text-lg leading-relaxed">
          Source code for this app is available <a href="https://github.com/rdas1/PawPrints" className="underline">here</a>.
        </p>

        <p className="text-lg leading-relaxed">
            Feel free to check out the other projects in my portfolio as well! I'm especially proud of <a href="https://github.com/rdas1/bus-time" className="underline">this one</a>, which I built to help my neighbors catch their buses on time.
        </p>
  
        <p className="text-lg leading-relaxed">
          Thank you for visiting — I hope you enjoy exploring the app!
        </p>

        <p className="text-lg leading-relaxed">
          - Rajrishi Das
        </p>

        <SleepyFooter />
      </div>
    );
  }
  