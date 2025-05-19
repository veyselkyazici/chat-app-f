const CONTACTS_SERVICE_URL = "http://localhost:8080/api/v1/contacts";
const INVITATION_SERVICE_URL = "http://localhost:8080/api/v1/invitation";
export async function deleteContactOrInvitation(id, type) {
    const url = type === 'contact' ? `${CONTACTS_SERVICE_URL}/${id}` : `${INVITATION_SERVICE_URL}/${id}`;
    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'Authorization': sessionStorage.getItem('access_token'),
            },
        });

        if (!response.ok) {
            throw new Error('Unauthorized');
        }

        return await response.json();
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
}


export async function fetchSendInvitation(data) {
    const requestBody = {
        invitationId: data.invitationId,
        inviteeEmail: data.email,
        contactName: data.userContactName,
        inviterUserId: data.inviterUserId,
        isInvited: data.invited,
        inviterEmail: null
    }
    try {
        const response = await fetch(`${INVITATION_SERVICE_URL}/send-invitation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error('Error updating invitation:', error);
    }
}

export const fetchGetContactList = async (userId) => {
    try {
        const response = await fetch(`${CONTACTS_SERVICE_URL}/get-contact-list?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            },
        });
        if (!response.ok) {
            throw new Error('Kullanıcı bulunamadı');
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};

export const fetchAddContact = async (dto, closeModal) => {
    try {
        const response = await fetch(`${CONTACTS_SERVICE_URL}/add-contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            },
            body: JSON.stringify(dto),
        });

        if (!response.ok) {
            toastr.error('Beklenmedik bir hata oluştu.')
            return;
        }

        toastr.success('Kullanıcı başarıyla eklendi!');
        closeModal();
    } catch (error) {
        toastr.error('İşlem sırasında bir hata oluştu.');
        throw error;
    }
};