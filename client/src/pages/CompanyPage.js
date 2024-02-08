import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { getCompany } from "../lib/graphql/queries";
import JobList from "../components/JobList";

function CompanyPage() {
  const { companyId } = useParams();
  const [state, setState] = useState({
    company: null,
    status: "loading",
  });
  useEffect(() => {
    (async () => {
      try {
        const company = await getCompany(companyId);
        setState({ company, status: "success" });
      } catch (error) {
        console.log(error);
        setState({ company: null, status: "error" });
      }
    })();
  }, [companyId]);
  const { company, status } = state;
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (status === "error") {
    return <div className="has-text-danger">data unavailable...</div>;
  }
  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>
      <h2 className="title is-5">Jobs at {company.name}</h2>
      <JobList jobs={company.job} />
    </div>
  );
}

export default CompanyPage;
