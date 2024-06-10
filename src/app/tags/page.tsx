import { TagForm } from "~/components/TagForm";
import { TagTable } from "~/components/TagTable";

function TagsPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <TagForm />
        </div>
        <div>
          <TagTable />
        </div>
      </div>
    </div>
  );
}

export default TagsPage;
