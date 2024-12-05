"use client"
import {useEffect} from "react";
import { useState } from "react"
import axios from "axios" // Add this import
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload,Download,FileText, Brain, Heart, Activity, X } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { TextGenerateEffect } from "@/components/ui/Text-generate-effect"
import {promises} from "node:dns";
interface FileInfo {
    id: string;
    filename: string;
    uploadDate: string;

}
export default function EveWelcome() {4
    const [uploadHover, setUploadHover] = useState(false)
    const [maximizedCard, setMaximizedCard] = useState<number | null>(null)
    const [uploadProgress, setUploadProgress] = useState(0) // Add this line
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [files, setFiles] = useState<FileInfo[]>([])
    const [showFiles, setShowFiles] = useState(false)

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axios.post('/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(percentCompleted);
                    },
                });

                setUploadProgress(0); // Reset progress after successful upload
                alert('File uploaded successfully!');
            } catch (error) {
                console.error('File upload failed', error);
                alert('File upload failed');
            }
        }
    };

    const fetchFiles = async () => {
        try {
            const response = await axios.get('http://localhost:5000/files');
            setFiles(response.data);
        } catch (error) {
            console.error('Failed to fetch files', error);
            alert('Failed to load files');
        }
    };

    const handleFileView = (fileId: string) => {
        // Implement file viewing logic here
        // This could open a modal, navigate to a new page, or trigger a download
        window.open(`http://localhost:5000/files/${fileId}`, '_blank');
    };

    useEffect(() => {
        if (showFiles) {
            fetchFiles();
        }
    }, [showFiles]);


    const features = [
        {
            icon: <Brain className="h-12 w-12 text-purple-500" />,
            title: "AI-Powered Insights",
            description: "Eve analyzes your health data to provide personalized recommendations and insights."
        },
        {
            icon: <Heart className="h-12 w-12 text-red-500" />,
            title: "Holistic Health Tracking",
            description: "Monitor various aspects of your health, from nutrition to sleep patterns, all in one place."
        },
        {
            icon: <Activity className="h-12 w-12 text-green-500" />,
            title: "Progress Visualization",
            description: "See your health journey unfold with intuitive charts and progress indicators."
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black text-gray-900 dark:text-gray-100 transition-all">
            <div className="container mx-auto px-4 py-8">
                <main className="space-y-8">
                    <section className="text-center">
                        <TextGenerateEffect className="text-3xl font-bold mb-4" words={"Welcome to Eve"}/>
                        <p className="text-xl mb-6">
                            Your personal AI health assistant, here to help you understand and improve your well-being.
                        </p>

                        {/* Upload Button */}
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileUpload}
                            style={{display: "none"}}
                            id="file-upload"
                        />
                        <Button
                            size="lg"
                            className="group relative overflow-hidden mb-4"
                            onClick={() => document.getElementById("file-upload")?.click()}
                            onMouseEnter={() => setUploadHover(true)}
                            onMouseLeave={() => setUploadHover(false)}
                        >
                            {uploadProgress > 0 ? (
                                `Uploading... ${uploadProgress}%`
                            ) : (
                                <>
                                    <span
                                        className={`transition-all duration-300 ${uploadHover ? "opacity-0" : "opacity-100"}`}>
                                        Upload Your Results or Prescriptions
                                    </span>
                                    <Upload
                                        className={`absolute inset-0 m-auto transition-all duration-300 ${uploadHover ? "scale-150" : "scale-0"}`}
                                    />
                                </>
                            )}
                        </Button>

                        {/* Download Button */}
                        <Button
                            size="lg"
                            className="group relative overflow-hidden"
                            onClick={() => setShowFiles(!showFiles)}
                        >
                            <span className="transition-all duration-300">
                                {showFiles ? 'Hide Files' : 'View Files'}
                            </span>
                            <FileText className="ml-2 h-5 w-5"/>
                        </Button>
                    </section>

                    {/* Animated Files Display */}
                    {showFiles && (
                        <section className="mt-8">
                            <h3 className="text-2xl font-bold mb-6 text-center">Your Files</h3>
                            <AnimatePresence>
                                <motion.div
                                    className="grid md:grid-cols-3 gap-6"
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: {
                                            opacity: 1,
                                            transition: {
                                                delayChildren: 0.2,
                                                staggerChildren: 0.1
                                            }
                                        }
                                    }}
                                >
                                    {files.map((file, index) => (
                                        <motion.div
                                            key={file.id}
                                            variants={{
                                                hidden: { opacity: 0, y: 20 },
                                                visible: {
                                                    opacity: 1,
                                                    y: 0,
                                                    transition: {
                                                        type: "spring",
                                                        stiffness: 300,
                                                        damping: 25
                                                    }
                                                }
                                            }}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <Card className="hover:shadow-lg transition-all">
                                                <CardHeader>
                                                    <CardTitle className="flex items-center gap-2">
                                                        <FileText className="h-6 w-6 text-blue-500"/>
                                                        <span>{file.name}</span>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-sm text-gray-500">
                                                        Uploaded: {new Date(file.uploadDate).toLocaleDateString()}
                                                    </p>
                                                    <Button
                                                        className="mt-4 w-full"
                                                        onClick={() => handleFileView(file.id)}
                                                    >
                                                        View File
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>

                            {files.length === 0 && (
                                <motion.p
                                    className="text-center text-gray-500"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    No files uploaded yet
                                </motion.p>
                            )}
                        </section>
                    )}

                    {/* Rest of the existing component remains the same */}
                    <section className="grid md:grid-cols-3 gap-6 relative" style={{minHeight: '300px'}}>
                        <AnimatePresence>
                            {features.map((feature, index) => (
                                <FeatureCard
                                    key={index}
                                    {...feature}
                                    isMaximized={maximizedCard === index}
                                    onClick={() => setMaximizedCard(maximizedCard === index ? null : index)}
                                    onClose={() => setMaximizedCard(null)}
                                />
                            ))}
                        </AnimatePresence>
                    </section>

                    {/* Existing sections remain unchanged */}
                </main>
            </div>
        </div>
    )
}

// FeatureCard component remains unchanged from the previous version
function FeatureCard({icon, title, description, isMaximized, onClick, onClose}: {
    icon: React.ReactNode,
    title: string,
    description: string,
    isMaximized: boolean,
    onClick: () => void,
    onClose: () => void
}) {
    return (
        <motion.div
            layout
            initial={{opacity: 0, scale: 0.8}}
            animate={{
                opacity: 1,
                scale: 1,
                width: isMaximized ? '100%' : '100%',
                height: isMaximized ? '100%' : 'auto',
                position: isMaximized ? 'absolute' : 'relative',
                zIndex: isMaximized ? 10 : 1,
            }}
            exit={{opacity: 0, scale: 0.8}}
            transition={{type: "spring", stiffness: 300, damping: 25}}
            onClick={onClick}
            className="cursor-pointer"
        >
            <Card className="h-full transition-all duration-300 hover:shadow-lg overflow-hidden">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {icon}
                        <span>{title}</span>
                    </CardTitle>
                    {isMaximized && (
                        <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 right-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                        >
                            <X className="h-4 w-4"/>
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    <p>{description}</p>
                    {isMaximized && (
                        <div className="mt-4">
                            <h4 className="text-lg font-semibold mb-2">Additional Information</h4>
                            <p>
                                This is where you can add more detailed information about the feature when the card is
                                maximized.
                                You can include things like:
                            </p>
                            <ul className="list-disc list-inside mt-2">
                                <li>Specific benefits of the feature</li>
                                <li>How to best utilize this aspect of Eve</li>
                                <li>Related features or integrations</li>
                                <li>User testimonials or success stories</li>
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    )
}