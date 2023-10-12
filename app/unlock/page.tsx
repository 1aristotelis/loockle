import UnlockForm from "@/components/UnlockForm";

export default function UnlockPage(){
    return (
        <div className='min-h-screen bg-base-200 flex justify-center items-center'>
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-center">Unlock your coins</h2>
                    <div className="card-actions">
                        <UnlockForm/>
                    </div>
                </div>
            </div>
        </div>
    )
}