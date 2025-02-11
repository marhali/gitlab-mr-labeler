import { describe, it, expect, vi } from 'vitest';
import assignMergeRequestLabels from '@/infrastructure/assign-merge-request-labels.ts';

describe('assignMergeRequestLabels()', () => {
  const labels = ['alpha', 'bravo', 'charlie'];
  const environment: Parameters<typeof assignMergeRequestLabels>[1] = {
    GL_MR_LABELER_ACCESS_TOKEN: 'myPrivateToken',
    CI_API_V4_URL: 'https://gitlab.local/api/v4',
    CI_PROJECT_ID: 'myProjectId',
    CI_MERGE_REQUEST_IID: 'myMergeRequestIId',
  };
  it('should assign appending labels to merge request using a "PUT" api request', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await assignMergeRequestLabels(labels, environment, { assignMethod: 'APPEND' });

    expect(fetchMock).toHaveBeenLastCalledWith('https://gitlab.local/api/v4/projects/myProjectId/myMergeRequestIId', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'PRIVATE-TOKEN': 'myPrivateToken',
      },
      body: JSON.stringify({ add_labels: labels.join(',') }),
    });
  });
  it('should override labels of merge request using "PUT" api request', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await assignMergeRequestLabels(labels, environment, { assignMethod: 'OVERRIDE' });

    expect(fetchMock).toHaveBeenLastCalledWith('https://gitlab.local/api/v4/projects/myProjectId/myMergeRequestIId', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'PRIVATE-TOKEN': 'myPrivateToken',
      },
      body: JSON.stringify({ labels: labels.join(',') }),
    });
  });
  it('should throw exception if fetch request fails', async () => {
    const fetchError = new Error('myFailure');
    vi.stubGlobal('fetch', () => Promise.reject(fetchError));

    await expect(assignMergeRequestLabels(labels, environment, { assignMethod: 'APPEND' })).rejects.toThrow(
      new Error('Could not assign merge request labels.', { cause: fetchError }),
    );
  });
});
