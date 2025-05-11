import { useEffect, useState } from "react";
import apiRequest from "../../components/lib/apiRequest";
import "./agencies.scss";

function AgenciesPage() {
  const [agencies, setAgencies] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const res = await apiRequest.get("/users", {
          withCredentials: true,
        });

        const filtered = res.data.filter(
          (user) =>
            user.role === "agency" &&
            user.agencyName &&
            user.location &&
            user.phone &&
            user.website
        );

        setAgencies(filtered);
      } catch (err) {
        console.log(err);
        setError("Failed to load agencies.");
      }
    };

    fetchAgencies();
  }, []);

  return (
    <div className="agenciesPage">
      <h1>Partner Agencies</h1>
      {error && <span className="error">{error}</span>}

      <div className="agencyList">
        {agencies.map((agency) => (
          <div className="agencyCard" key={agency.id}>
            <img
              src={agency.avatar || "/noavatar.jpg"}
              alt={agency.agencyName}
              className="avatar"
            />
            <div className="info">
              <h2>{agency.agencyName}</h2>
              <p>
                <b>Location: </b> {agency.location}
              </p>
              <p>
                <b>Phone: </b> {agency.phone}
              </p>
              <p>
                <b>Website: </b>
                {agency.website}
              </p>
              <p>
                <b>About: </b> {agency.about || "No description provided."}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AgenciesPage;
