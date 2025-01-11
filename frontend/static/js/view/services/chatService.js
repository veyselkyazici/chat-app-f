const CHAT_SERVICE_URL = "http://localhost:8080/api/v1/chat";
export const fetchDeleteChat = async (userChatSettings) => {
    try {
        const token = sessionStorage.getItem('access_token');
        if (!token) {
            throw new Error('Access token not found');
        }

        const response = await fetch(`${CHAT_SERVICE_URL}/delete-chat`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify(userChatSettings),
        });

        if (!response.ok) {
            const errorData = await response.json();
            toastr.error(errorData.message);
            throw new Error(errorData.message);
        } else {
            return true;
        }
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};

export const fetchGetLast30Messages = async (chatRoomId, userId) => {
    try {
        const token = sessionStorage.getItem('access_token');
        if (!token) {
            throw new Error('Access token not found');
        }

        const response = await fetch(`${CHAT_SERVICE_URL}/messages/last-30-messages?chatRoomId=${chatRoomId}&limit=30&userId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            }
        });

        if (!response.ok) {
            throw new Error('Kullanıcı bulunamadı');
        }

        const result = await response.json();
        console.log("KARDESIM TEMIZLE ARTIK SURAYI > ", result);
        return result;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};

export async function fetchGetChatSummary(userId, userContactId, chatRoomId) {
    try {
        const response = await fetch(`${CHAT_SERVICE_URL}/chat-summary?userId=${userId}&userContactId=${userContactId}&chatRoomId=${chatRoomId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': sessionStorage.getItem('access_token'),
            },
        });

        if (!response.ok) {
            throw new Error('Unauthorized');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
}

export const fetchGetChatMessage = async (chatRequestDTO) => {
    try {
        const response = await fetch(`${CHAT_SERVICE_URL}/get-chat-message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            },
            body: JSON.stringify(chatRequestDTO),
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

export const fetchGetLatestMessages = async (chatRoomId) => {
    try {
        const token = sessionStorage.getItem('access_token');
        if (!token) {
            throw new Error('Access token not found');
        }

        const response = await fetch(`${CHAT_SERVICE_URL}/messages/latest?chatRoomId=${chatRoomId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            }
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

export async function fetchCheckChatRoomExists(userId, contactId) {
    try {
        const response = await fetch(`${CHAT_SERVICE_URL}/check-chat-room-exists/${userId}/${contactId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': sessionStorage.getItem('access_token'),
            },
        });

        if (!response.ok) {
            throw new Error('Unauthorized');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
}

export const fetchChatBlock = async (chatSummaryDTO) => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('Access token not found. Please log in again.');
    }

    try {
        const response = await fetch(`${CHAT_SERVICE_URL}/chat-block`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify(chatSummaryDTO),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to block the user');
        }

        return await response.json();
    } catch (error) {
        console.error('FetchChatBlock Error:', error.message);
        throw error;
    }
};

export const fetchChatPinned = async (chatSummaryDTO) => {
    try {
        const token = sessionStorage.getItem('access_token');
        if (!token) {
            throw new Error('Access token not found');
        }

        const response = await fetch(`${CHAT_SERVICE_URL}/chat-pinned`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify(chatSummaryDTO),
        });

        if (!response.ok) {
            const errorData = await response.json();
            toastr.error(errorData.message);
            throw new Error(errorData.message);
        }

        const result = await response.json();
        toastr.success(result.message);
        console.log(result);
        return result;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};
export const fetchChatUnPinned = async (chatSummaryDTO) => {
    try {
        const token = sessionStorage.getItem('access_token');
        if (!token) {
            throw new Error('Access token not found');
        }

        const response = await fetch(`${CHAT_SERVICE_URL}/chat-unpinned`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify(chatSummaryDTO),
        });

        if (!response.ok) {
            const errorData = await response.json();
            toastr.error(errorData.message);
            throw new Error(errorData.message);
        }

        const result = await response.json();
        toastr.success(result.message);
        console.log(result);
        return result;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};
export const fetchChatUnblock = async (chatSummaryDTO) => {
    try {
        const token = sessionStorage.getItem('access_token');
        if (!token) {
            throw new Error('Access token not found');
        }

        const response = await fetch(`${CHAT_SERVICE_URL}/chat-unblock`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify(chatSummaryDTO),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to block the user');
        }

        return await response.json();
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};


export const fetchGetChatSummaries = async (userId) => {
    try {
        const token = sessionStorage.getItem('access_token');
        if (!token) {
            throw new Error('Access token not found');
        }

        const response = await fetch(`${CHAT_SERVICE_URL}/chat-summaries/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            }
        });

        if (!response.ok) {
            throw new Error('Kullanıcı bulunamadı');
        }

        const result = await response.json();
        console.log(result);
        return result;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};

export async function fetchCreateChatRoomIfNotExists(userId, friendId) {
    try {
        const response = await fetch(`${CHAT_SERVICE_URL}/create-chat-room-if-not-exists`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': sessionStorage.getItem('access_token'),
            },
            body: JSON.stringify({ userId: userId, friendId: friendId }),
        });

        if (!response.ok) {
            throw new Error('Unauthorized');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
}

export const fetchGetOlder30Messages = async (chatRoomId, before) => {
    try {
        const token = sessionStorage.getItem('access_token');
        if (!token) {
            throw new Error('Access token not found');
        }

        const response = await fetch(`${CHAT_SERVICE_URL}/messages/older-30-messages?chatRoomId=${chatRoomId}&before=${before}&limit=30`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            }
        });

        if (!response.ok) {
            throw new Error('Kullanıcı bulunamadı');
        }

        const result = await response.json();
        console.log(result);
        return result;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};

export async function checkUserOnlineStatus(userId) {
    try {
        const response = await fetch(`http://localhost:8080/status/is-online/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': sessionStorage.getItem('access_token'),
            }
        });
        if (!response.ok) {
            throw new Error('Kullanıcı durumu kontrol edilemedi');
        }
        const isOnline = await response.json();
        console.log("IS ONLINE > ", isOnline)
        return isOnline;
    } catch (error) {
        console.error('Hata:', error.message);
        return false;
    }
}