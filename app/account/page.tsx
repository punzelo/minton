import { PageContainer } from "@/components/layout/PageContainer";
import { DeleteAccountButton } from "@/components/account/DeleteAccountButton";
import { Card } from "@/components/ui/Card";

export default function AccountPage() {
  return (
    <PageContainer>
      <Card className="max-w-2xl">
        <h1 className="text-2xl font-bold">계정 관리</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          잘못 가입한 계정은 여기에서 삭제할 수 있습니다. 계정을 삭제하면 Supabase Auth 계정,
          프로필, 내가 만든 대회와 경기 데이터가 함께 삭제됩니다.
        </p>
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <h2 className="font-semibold text-red-700">위험 작업</h2>
          <p className="mt-1 text-sm text-red-700">삭제 후에는 복구할 수 없습니다.</p>
          <div className="mt-4">
            <DeleteAccountButton />
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}
