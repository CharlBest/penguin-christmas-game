export const data = `
//Auto increment user ids
OPTIONAL MATCH (nextComment:Comment)
WITH nextComment, CASE WHEN nextComment IS NULL THEN 1 ELSE nextComment.id + 1 END as nextId
ORDER BY nextComment.id DESC
LIMIT 1

MATCH (user:User { id: {userId} }), (item:Item { uId: {itemUId} })

CREATE (user)-[:MADE_COMMENT]->(comment:Comment { id: nextId, uId: {uId}, description: {description}, dateCreated: timestamp() })<-[:HAS_COMMENT]-(item)

SET user.itemCommentCount = SIZE((user)-[:MADE_COMMENT]->())
SET item.itemCommentCount = SIZE((item)-[:HAS_COMMENT]->())

WITH user, item, comment
MATCH (itemUser:User)-[:HAS_ITEM]->(item)

RETURN properties(comment) as comment, 
CASE WHEN itemUser.nt1 IS NOT NULL THEN itemUser.pushSubscription ELSE null END as pushSubscription,
user
{
    id: user.id,
    username: user.username,
    avatarUrl: user.avatarUrl
}
`