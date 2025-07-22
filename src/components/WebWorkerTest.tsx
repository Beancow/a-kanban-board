import { Button } from '@radix-ui/themes';
import { useAppState } from './AppStateProvider';
import { useWebWorker } from '@/hooks/useWebWorker';

export function WebWorkerTest() {
    const { user, boards, todos, organizations } = useAppState();

    const {
        isWorkerReady,
        workerError,
        lastPayloadCount,
        syncUserData,
        syncTodoData,
        syncOrganizationData,
        syncBoardData,
    } = useWebWorker();

    return (
        <div
            style={{
                padding: '1rem',
                border: '1px solid #ccc',
                borderRadius: '8px',
                margin: '1rem 0',
            }}
        >
            <h3>Web Worker Status</h3>
            <div style={{ marginBottom: '1rem' }}>
                <p>
                    <strong>Status:</strong>{' '}
                    {isWorkerReady ?
                        '✅ Ready'
                    : workerError ?
                        '❌ Error'
                    :   '⏳ Loading...'}
                </p>
                {workerError && (
                    <p style={{ color: 'red' }}>
                        <strong>Error:</strong> {workerError}
                    </p>
                )}
                <p>
                    <strong>Data Items:</strong> {lastPayloadCount || 0}
                </p>
                <p>
                    <strong>Current User:</strong>{' '}
                    {user?.name || 'Not logged in'}
                </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Button
                    onClick={() => syncTodoData(todos)}
                    disabled={!isWorkerReady}
                    variant='solid'
                    color='blue'
                >
                    Backup Todo Data
                </Button>

                <Button
                    onClick={() => syncUserData(user)}
                    disabled={!isWorkerReady}
                    variant='solid'
                    color='blue'
                >
                    Backup User Data
                </Button>

                <Button
                    onClick={() => syncOrganizationData(organizations)}
                    disabled={!isWorkerReady}
                    variant='solid'
                    color='blue'
                >
                    Backup Organization Data
                </Button>

                <Button
                    onClick={() => syncBoardData(boards)}
                    disabled={!isWorkerReady}
                    variant='solid'
                    color='blue'
                >
                    Sync Board Data
                </Button>

                <Button
                    onClick={() => {
                        if (isWorkerReady) {
                            console.log('Web Worker is ready for operations');
                        } else {
                            console.log('Web Worker is not ready');
                        }
                    }}
                    variant='outline'
                    color='gray'
                >
                    Test Worker
                </Button>
            </div>

            <div
                style={{
                    marginTop: '1rem',
                    fontSize: '0.875rem',
                    color: '#666',
                }}
            >
                <p>This component demonstrates web worker integration:</p>
                <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                    <li>Auto-sync every minute</li>
                    <li>Auto-backup every 5 minutes</li>
                    <li>Background processing without blocking UI</li>
                </ul>
            </div>
        </div>
    );
}
