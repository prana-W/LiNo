import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Index() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <View style={styles.heroSection}>
                <View style={styles.iconContainer}>
                    <Text style={styles.iconText}>🚀</Text>
                </View>
                <Text style={styles.title}>Welcome to Your App</Text>
                <Text style={styles.subtitle}>
                    Start your journey with us today. Build, learn, and grow together.
                </Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => router.push('/login')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.primaryButtonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => router.push('/signup')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.secondaryButtonText}>Create Account</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tertiaryButton}
                    activeOpacity={0.6}
                >
                    <Text style={styles.tertiaryButtonText}>Continue as Guest</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    By continuing, you agree to our Terms & Privacy Policy
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
        justifyContent: 'space-between',
        paddingVertical: 60,
        paddingHorizontal: 24,
    },
    heroSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -40,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
        borderWidth: 2,
        borderColor: 'rgba(99, 102, 241, 0.3)',
    },
    iconText: {
        fontSize: 60,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        color: '#94a3b8',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 16,
    },
    buttonContainer: {
        width: '100%',
        gap: 16,
    },
    primaryButton: {
        backgroundColor: '#6366f1',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: '#1e293b',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#334155',
    },
    secondaryButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    tertiaryButton: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    tertiaryButtonText: {
        color: '#94a3b8',
        fontSize: 16,
        fontWeight: '500',
    },
    footer: {
        marginTop: 24,
    },
    footerText: {
        color: '#64748b',
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
    },
});
