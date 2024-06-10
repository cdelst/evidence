import { EvidenceTypeForm } from "~/components/EvidenceTypeForm";
import { EvidenceTypeTable } from "~/components/EvidenceTypeTable";

function EvidenceTypesPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <EvidenceTypeForm />
        </div>
        <div>
          <EvidenceTypeTable />
        </div>
      </div>
    </div>
  );
}

export default EvidenceTypesPage;
