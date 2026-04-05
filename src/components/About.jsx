const About = () => {
  return (
    <section id="about" className="bg-white py-14 px-4 scroll-mt-12">
      <div className="mx-auto max-w-4xl">
        {/* Heading */}
        <h2 className="mb-8 text-center text-4xl md:text-5xl font-bold">
          <span className=" text-black">About Us</span>
        </h2>

        {/* Who Are We */}
        <div className="mb-8 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-12 md:p-6">
          <div className="mb-6 flex items-center">
            <i className="fas fa-users mr-6 text-lg md:text-2xl text-purple-600"></i>
            <h3 className="text-2xl md:text-2xl font-bold text-black">
              Who Are We?
            </h3>
          </div>
          <p className="text-base md:text-lg leading-relaxed text-gray-500  ">
            Gopal's Property Maintenance Services delivers reliable and
            high-quality property care backed by trust, experience, and
            professionalism.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="mb-1 grid gap-8 md:grid-cols-2">
          {/* Mission */}
          <div className="rounded-3xl bg-gradient-to-br from-yellow-50 to-yellow-50 p-8">
            <div className="mb-6 flex items-center">
              <i className="fas fa-bullseye mr-6 text-lg md:text-2xl text-blue-600"></i>
              <h3 className="text-2xl md:text-2xl font-bold text-black">
                Our Mission
              </h3>
            </div>
            <p className="text-base md:text-lg leading-relaxed text-gray-500">
              To be the nation’s most trusted property care provider, setting
              new standards in quality and customer satisfaction.
            </p>
          </div>

          {/* Vision */}
          <div className="rounded-3xl bg-gradient-to-br from-green-50 to-green-50 p-8">
            <div className="mb-6 flex items-center">
              <i className="fas fa-eye mr-6 text-lg md:text-2xl text-pink-600"></i>
              <h3 className="text-2xl md:text-2xl font-bold text-black">
                Our Vision
              </h3>
            </div>
            <p className="text-base md:text-lg leading-relaxed text-gray-500">
              To become the nation&apos;s most trusted and innovative property
              care provider, setting new standards in quality, sustainability,
              and customer service.
            </p>
          </div>
        </div>

    
      </div>
    </section>
  );
};

export default About;