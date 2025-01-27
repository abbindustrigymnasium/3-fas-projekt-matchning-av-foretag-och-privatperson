// Function to determine which users are qualified based on their qualifications
export const determineQualified = (comparisonDict, mainDict) => {
    // Initialize an empty array to store the qualified users
    const qualified = [];

    // Parse the main user's qualifications from `content`, split by commas, trim whitespaces, and filter out empty values
    const mainQualifications = mainDict?.content?.split(',').map((q) => q.trim()).filter(q => q.length > 0) || [];
    console.log("Main Qualifications:", mainQualifications);

    // Iterate over each key in the comparison dictionary
    for (const key in comparisonDict) {
        // Parse the comparison user's qualifications from `content`, following the same process
        const comparisonQualifications = comparisonDict[key]?.content
            ?.split(',').map((r) => r.trim()).filter(r => r.length > 0) || [];
        console.log(`Comparison Qualifications for ${key}:`, comparisonQualifications);

        // Skip the current comparison user if either of the qualifications list is empty
        if (mainQualifications.length === 0 || comparisonQualifications.length === 0) {
            console.log("Skipping user due to empty qualifications");
            continue;
        }

        // Find the common qualifications between the main user and the comparison user
        const commonQualifications = comparisonQualifications.filter((req) => mainQualifications.includes(req));
        console.log("Common Qualifications:", commonQualifications);

        // Calculate the match percentage for the main user and the comparison user
        const mainMatchPercentage = mainQualifications.length > 0 ? (commonQualifications.length / mainQualifications.length) * 100 : 0;
        const comparisonMatchPercentage = comparisonQualifications.length > 0 ? (commonQualifications.length / comparisonQualifications.length) * 100 : 0;

        // Ensure the match percentages are valid numbers (no NaN values)
        if (commonQualifications.length > 0) {
            qualified.push({
                userId: key,
                userName: comparisonDict[key]?.fullName || "Unknown User",
                mainMatchPercentage: isNaN(mainMatchPercentage) ? 0 : mainMatchPercentage,
                comparisonMatchPercentage: isNaN(comparisonMatchPercentage) ? 0 : comparisonMatchPercentage,
                commonQualifications,
            });
        }
    }

    // Return the list of qualified users with their match percentages and common qualifications
    return qualified;
};

// Function to calculate the match percentages for the qualified users
// This function is used to structure and return the calculated percentages in a clean format
export const calculateMatchPercentage = (qualifiedUsers) => {
    // Initialize an empty object to store the match percentages for each qualified user
    const percentages = {};

    // Iterate over the list of qualified users
    qualifiedUsers.forEach((user) => {
        // Store the user's match percentages and common qualifications in the percentages object
        percentages[user.userId] = {
            userName: user.userName,
            mainMatchPercentage: user.mainMatchPercentage,
            comparisonMatchPercentage: user.comparisonMatchPercentage,
            commonQualifications: user.commonQualifications,
        };
    });

    // Return the object with the match percentages
    return percentages;
};
