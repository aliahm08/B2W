import { addCommentAction } from '@/lib/actions/comments';
import type { CommentRecord } from '@/lib/types';

export function CommentThread({
  comments,
  organizationId,
  proposalId,
  deliverableId
}: {
  comments: CommentRecord[];
  organizationId: string;
  proposalId?: string;
  deliverableId?: string;
}) {
  return (
    <section className="panel">
      <div className="split">
        <div>
          <p className="eyebrow">Comments</p>
          <h2 style={{ margin: '10px 0 0', fontSize: 24 }}>Discussion</h2>
        </div>
      </div>

      <div className="comment-list" style={{ marginTop: 20 }}>
        {comments.length === 0 ? (
          <div className="empty-state">
            <p className="muted-copy" style={{ margin: 0 }}>No comments yet.</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div className="comment-item" key={comment.id}>
              <div className="split">
                <strong>{comment.author_profile_id}</strong>
                <span className="muted-copy" style={{ fontSize: 14 }}>{new Date(comment.created_at).toLocaleString()}</span>
              </div>
              <p style={{ marginBottom: 0, lineHeight: 1.65 }}>{comment.body}</p>
            </div>
          ))
        )}
      </div>

      <form action={addCommentAction} className="form-grid" style={{ marginTop: 20 }}>
        <input type="hidden" name="organizationId" value={organizationId} />
        <input type="hidden" name="proposalId" value={proposalId ?? ''} />
        <input type="hidden" name="deliverableId" value={deliverableId ?? ''} />
        <div className="field">
          <label htmlFor="body">Add comment</label>
          <textarea id="body" name="body" placeholder="Leave a note, question, or approval detail." required />
        </div>
        <div className="button-row">
          <button className="button" type="submit">
            Post Comment
          </button>
        </div>
      </form>
    </section>
  );
}
