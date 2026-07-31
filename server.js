const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const sgMail = require('@sendgrid/mail');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const InquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    service: { type: String, required: true },
    pincode: String,
    area: String,
    district: String,
    state: String,
    message: String,
    assignedTo: { type: String, default: null },
    status: { type: String, default: 'New' },
    comments: { type: String, default: '' },
    campaign: { type: String, default: 'direct' },
    createdAt: { type: Date, default: Date.now }
});
const Inquiry = mongoose.model('Inquiry', InquirySchema);

const UserSchema = new mongoose.Schema({
    role: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    pass: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

const ReferralSchema = new mongoose.Schema({
    type: { type: String, required: true },
    category: { type: String, default: '' },
    campaign: { type: String, required: true },
    url: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const Referral = mongoose.model('Referral', ReferralSchema);

const connectDB = async () => {
    try {
        if (process.env.MONGO_URI) {
            await mongoose.connect(process.env.MONGO_URI);
            console.log('HelloCustomer Connected to MongoDB Atlas.');
        } else {
            console.log('MONGO_URI missing. Running fallback structures.');
        }
    } catch (err) {
        console.error('DB Connection error:', err);
    }
};
connectDB();

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

app.post('/api/inquire', async (req, res) => {
    try {
        const { name, email, phone, service, pincode, area, district, state, message, campaign } = req.body;
        if (!name || !email || !phone || !service) {
            return res.status(400).json({ success: false, message: 'Mandatory fields missing.' });
        }
        await new Inquiry({
            name, email, phone, service, pincode, area, district, state,
            message: message || 'No notes',
            status: 'New',
            campaign: campaign || 'direct'
        }).save();

        if (process.env.SENDGRID_API_KEY && process.env.ADMIN_EMAIL) {
            const msg = {
                to: process.env.ADMIN_EMAIL,
                from: process.env.ADMIN_EMAIL,
                subject: `New HelloCustomer Lead: ${service} - ${name}`,
                text: `Name: ${name}\nPhone: ${phone}\nService: ${service}\nLocation: ${district}, ${state}`
            };
            await sgMail.send(msg).catch(err => console.error('SendGrid error:', err));
        }

        res.json({ success: true, message: 'Thank you! Your request has been successfully recorded at HelloCustomer.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server database error.' });
    }
});

app.get('/api/portal/records', async (req, res) => {
    try {
        const { email, role } = req.query;
        let query = {};
        if (role !== 'Admin') {
            query.assignedTo = email;
        }
        const allAssigned = await Inquiry.find(query).sort({ createdAt: -1 });
        const chunkedRecords = allAssigned.slice(0, 25);
        res.json({ success: true, totalAssigned: allAssigned.length, records: chunkedRecords });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error retrieving records.' });
    }
});

app.patch('/api/portal/records/:id', async (req, res) => {
    try {
        const { status, comments } = req.body;
        await Inquiry.findByIdAndUpdate(req.params.id, { status, comments });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

app.get('/api/portal/interested', async (req, res) => {
    try {
        const data = await Inquiry.find({ status: 'Interested' }).sort({ createdAt: -1 });
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

app.get('/api/portal/success', async (req, res) => {
    try {
        const data = await Inquiry.find({ status: 'Success' }).sort({ createdAt: -1 });
        const totalCount = await Inquiry.countDocuments();
        res.json({ success: true, data, totalCount });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

app.post('/api/admin/assign-batch', async (req, res) => {
    try {
        const { count, employee } = req.body;
        const limitNum = parseInt(count) || 25;
        const unassigned = await Inquiry.find({ assignedTo: { $in: [null, ''] } }).limit(limitNum);
        const ids = unassigned.map(u => u._id);
        await Inquiry.updateMany({ _id: { $in: ids } }, { assignedTo: employee });
        res.json({ success: true, message: `Successfully assigned ${ids.length} records to ${employee}.` });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Batch assignment failed.' });
    }
});

app.post('/api/admin/provision-user', async (req, res) => {
    try {
        const { role, username, pass } = req.body;
        if (!username || !pass || !role) return res.status(400).json({ success: false, message: 'Missing fields.' });
        await new User({ role, username, pass }).save();
        res.json({ success: true, message: `Provisioned ${role} portal for ${username}.` });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Username exists or invalid.' });
    }
});

app.post('/api/admin/referrals', async (req, res) => {
    try {
        const { type, category, campaign } = req.body;
        let baseUrl = req.protocol + '://' + req.get('host');
        let generatedUrl = `${baseUrl}/`;

        if (type === 'category') {
            let pageName = 'health-insurance.html';
            if (category === 'Life Insurance') pageName = 'life-insurance.html';
            if (category === 'Motor Insurance') pageName = 'motor-insurance.html';
            if (category === 'Loan Processing') pageName = 'loan-processing.html';
            generatedUrl = `${baseUrl}/${pageName}?ref=${encodeURIComponent(campaign)}`;
        } else if (type === 'form') {
            generatedUrl = `${baseUrl}/?view=form&ref=${encodeURIComponent(campaign)}`;
        } else {
            generatedUrl = `${baseUrl}/?ref=${encodeURIComponent(campaign)}`;
        }

        await new Referral({ type, category: type === 'category' ? category : '', campaign, url: generatedUrl }).save();
        res.json({ success: true, url: generatedUrl, message: 'Referral link created.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error generating link.' });
    }
});

app.get('/api/admin/referrals', async (req, res) => {
    try {
        const data = await Referral.find().sort({ createdAt: -1 });
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

app.get('/api/admin/export-csv', async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        let csv = 'Date,Name,Email,Phone,Service,District,State,Status,AssignedTo,Campaign,Comments\n';
        inquiries.forEach(l => {
            csv += `"${new Date(l.createdAt).toLocaleDateString()}","${l.name}","${l.email}","${l.phone}","${l.service}","${l.district || ''}","${l.state || ''}","${l.status}","${l.assignedTo || 'Unassigned'}","${l.campaign || 'direct'}","${(l.comments || '').replace(/"/g, '""')}"\n`;
        });
        res.header('Content-Type', 'text/csv');
        res.attachment('hellocustomer_reports.csv');
        res.send(csv);
    } catch (err) {
        res.status(500).send('Error generating export file.');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`HelloCustomer platform running on port ${PORT}`);
});
