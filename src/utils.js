export const getFileUrl = (record, fileName) => {
    if (!record || !fileName) return null;
    return `${pb.baseUrl}/api/files/${record.collectionId}/${record.id}/${fileName}`;
};
