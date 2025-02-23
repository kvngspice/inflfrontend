const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('name', formData.name);
    formData.append('platform', formData.platform);
    formData.append('followers_count', formData.followers_count);
    formData.append('niche', formData.niche);
    formData.append('social_media_handle', formData.social_media_handle);
    formData.append('region', formData.region || 'Nigeria');
    
    if (formData.profile_picture) {
        formData.append('profile_picture', formData.profile_picture);
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/api/admin/influencers/add/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                // Don't set Content-Type header when sending FormData
            },
            body: formData
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to add influencer');
        }

        // Success
        setSuccess(true);
        resetForm();
        
    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
}; 